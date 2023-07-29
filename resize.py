from PIL import Image
import os

def rescale_image(target_width=500,folder_path="assets/images"):
    for filename in os.listdir(folder_path):
        if filename.lower().endswith('.jpg'):
            image_path = os.path.join(folder_path,filename)
            with Image.open(image_path) as img:
                w_percent = target_width / float(img.size[0])
                h_size = int(float(img.size[1])*w_percent)
                resized_img = img.resize((target_width,h_size))
                resized_img.save(image_path)

rescale_image()
            
