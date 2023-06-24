import numpy as np
from scipy.spatial import Delaunay
import trimesh
import matplotlib.pyplot as plt

def import_mesh_from_obj(file_path):
    # Load the mesh from the .obj file
    mesh = trimesh.load_mesh(file_path)

    # Return the mesh object
    return mesh

def generate_random_points_on_mesh(mesh, num_points):
    # Extract the vertices and faces from the mesh
    vertices = mesh.vertices
    faces = mesh.faces

    # Perform Delaunay triangulation on the mesh
    triangulation = Delaunay(vertices)

    # Compute the areas of each face in the mesh
    face_areas = np.linalg.norm(np.cross(vertices[faces[:, 0]] - vertices[faces[:, 1]], vertices[faces[:, 0]] - vertices[faces[:, 2]]), axis=1) / 2

    # Normalize face areas to use as probabilities for sampling
    probabilities = face_areas / np.sum(face_areas)

    # Sample random faces based on the probabilities
    sampled_faces = np.random.choice(np.arange(len(faces)), size=num_points, p=probabilities)

    # Generate random barycentric coordinates for each sampled face
    random_barycentric = np.random.rand(num_points, 2)
    mask = random_barycentric.sum(axis=1) > 1
    random_barycentric[mask] = 1 - random_barycentric[mask]

    # Compute the corresponding 3D coordinates for each random point
    random_points = vertices[faces[sampled_faces, 0]] + \
                    random_barycentric[:, 0, np.newaxis] * (vertices[faces[sampled_faces, 1]] - vertices[faces[sampled_faces, 0]]) + \
                    random_barycentric[:, 1, np.newaxis] * (vertices[faces[sampled_faces, 2]] - vertices[faces[sampled_faces, 0]])

    return random_points


def perspective_projection(points_3d, camera_position, fov):
    # Convert FOV to radians
    fov_rad = np.deg2rad(fov)
    
    # Calculate camera viewing direction
    viewing_direction = points_3d - camera_position
    
    # Normalize viewing direction
    viewing_direction_normalized = viewing_direction / np.linalg.norm(viewing_direction, axis=1)[:, np.newaxis]
    
    # Calculate projection factor
    p = np.tan(fov_rad / 2)
    
    # Perform perspective projection
    projected_x = viewing_direction_normalized[:, 0] / (p * viewing_direction_normalized[:, 2])
    projected_y = viewing_direction_normalized[:, 1] / (p * viewing_direction_normalized[:, 2])
    
    # Return the projected 2D points
    projected_points = np.column_stack((projected_x, projected_y))
    
    return projected_points

mesh = import_mesh_from_obj('Whale.obj')
points = generate_random_points_on_mesh(mesh,1000)

camera_position = np.array([0, 0, 0])
fov = 60  # Field of view in degrees

projected_points = perspective_projection(points,camera_position,fov)

plt.scatter(projected_points[:, 0], projected_points[:, 1])
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Projected 2D Points')
plt.show()