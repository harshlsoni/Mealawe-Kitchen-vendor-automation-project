import os
import shutil
import urllib.parse

# --- CONFIGURATION ---
label_dir = r'-----------------------------------'
source_images_dir = r'------------------------------'
output_dir = r'-----------------------------------------'

# Create new structure
os.makedirs(os.path.join(output_dir, 'images'), exist_ok=True)
os.makedirs(os.path.join(output_dir, 'labels'), exist_ok=True)

for label_file in os.listdir(label_dir):
    if not label_file.endswith('.txt'): continue

    # 1. Clean the filename (Handling that %5C and ?d= mess)
    decoded_name = urllib.parse.unquote(label_file)
    # Extract the core ID (e.g., 10001 from ?d=meal_images%5C10001.txt)
    clean_name = decoded_name.split('\\')[-1].split('/')[-1].split('=')[-1].replace('.txt', '')
    
    # 2. Define paths
    src_label = os.path.join(label_dir, label_file)
    dst_label = os.path.join(output_dir, 'labels', f"{clean_name}.txt")
    
    # 3. Find and copy the corresponding image
    # Assuming your original images are .jpg or .png
    img_found = False
    for ext in ['.jpg', '.jpeg', '.png']:
        potential_img = os.path.join(source_images_dir, f"{clean_name}{ext}")
        if os.path.exists(potential_img):
            dst_img = os.path.join(output_dir, 'images', f"{clean_name}{ext}")
            shutil.copy(potential_img, dst_img)
            shutil.copy(src_label, dst_label)
            print(f"Synced: {clean_name}")
            img_found = True
            break
    
    if not img_found:
        print(f"Warning: Image for {clean_name} not found in source folder.")

print("\nDataset ready for YOLO training!")