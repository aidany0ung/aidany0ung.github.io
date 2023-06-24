// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define whale geometry
const whaleGeometry = new THREE.BufferGeometry();
const numPoints = 100;
const whalePositions = [];
for (let i = 0; i < numPoints; i++) {
  const angle = (i / numPoints) * Math.PI * 2;
  const radius = 1;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const z = 0;
  whalePositions.push(x, y, z);
}
const whalePositionsAttribute = new THREE.Float32BufferAttribute(whalePositions, 3);
whaleGeometry.setAttribute('position', whalePositionsAttribute);

// Define fish geometry
const fishGeometry = new THREE.BufferGeometry();
const fishPositions = [];
for (let i = 0; i < numPoints; i++) {
  const angle = (i / numPoints) * Math.PI * 2;
  const radius = 0.7;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const z = 0;
  fishPositions.push(x, y, z);
}
const fishPositionsAttribute = new THREE.Float32BufferAttribute(fishPositions, 3);
fishGeometry.setAttribute('position', fishPositionsAttribute);

// Create materials and wireframe meshes
const material = new THREE.LineBasicMaterial({ color: 0x000000 });
const whaleWireframe = new THREE.LineSegments(whaleGeometry, material);
const fishWireframe = new THREE.LineSegments(fishGeometry, material);
fishWireframe.visible = false; // Initially hide the fish wireframe
scene.add(whaleWireframe);
scene.add(fishWireframe);

// Animation function to morph between geometries
function morphGeometries() {
  const whalePoints = whaleGeometry.attributes.position.array;
  const fishPoints = fishGeometry.attributes.position.array;
  const time = Date.now() * 0.001; // Get current time in seconds
  const duration = 5; // Duration of the morphing animation in seconds
  for (let i = 0; i < whalePoints.length; i += 3) {
    const whaleX = whalePoints[i];
    const whaleY = whalePoints[i + 1];
    const whaleZ = whalePoints[i + 2];
    const fishX = fishPoints[i];
    const fishY = fishPoints[i + 1];
    const fishZ = fishPoints[i + 2];
    // Calculate the morphed position based on the current time and duration
    const morphedX = (1 - time / duration) * whaleX + (time / duration) * fishX;
    const morphedY = (1 - time / duration) * whaleY + (time / duration) * fishY;
    const morphedZ = (1 - time / duration) * whaleZ + (time / duration) * fishZ;
    // Update the positions of the points in the geometries
    whalePoints[i] = morphedX;
    whalePoints[i + 1] = morphedY;
    whalePoints[i + 2] = morphedZ;
  }
  // Update the position attribute of the whale geometry
  whaleGeometry.attributes.position.needsUpdate = true;

  // Render the scene
  renderer.render(scene, camera);
  
  // Request the next animation frame
  requestAnimationFrame(morphGeometries);
  }
  
  // Render and animate the scene
  function animate() {
  // Call the morphGeometries function to start the animation
  morphGeometries();
  
  // Set up camera position and controls
  camera.position.z = 5;
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  // Function to handle window resizing
  function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onWindowResize, false);
  
  // Start the animation loop
  animate();
  }
  
  // Call the animate function to start the animation
  animate();
