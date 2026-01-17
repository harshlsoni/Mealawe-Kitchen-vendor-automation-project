import os
import random
import shutil

# --- CONFIG ---
root_dir = r'E:\Mealawe-Kitchen-vendor-automation-project\Dataset_Creation\YOLO_MODEL_TRAINING_DATA_V1\transformed_data_for_training'
train_ratio = 0.8  # 80% for training

# Define paths
images_dir = os.path.join(root_dir, 'images')
labels_dir = os.path.join(root_dir, 'labels')

# Create Train/Val structure
for split in ['train', 'val']:
    os.makedirs(os.path.join(root_dir, split, 'images'), exist_ok=True)
    os.makedirs(os.path.join(root_dir, split, 'labels'), exist_ok=True)

# Get all image filenames (without extension)
all_files = [f.split('.')[0] for f in os.listdir(images_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
random.shuffle(all_files)

# Calculate split index
split_idx = int(len(all_files) * train_ratio)
train_files = all_files[:split_idx]
val_files = all_files[split_idx:]

def move_files(file_list, split_name):
    for f in file_list:
        # Find the actual image extension
        img_ext = next(ext for ext in ['.jpg', '.jpeg', '.png'] if os.path.exists(os.path.join(images_dir, f + ext)))
        
        # Move Image
        shutil.move(os.path.join(images_dir, f + img_ext), 
                    os.path.join(root_dir, split_name, 'images', f + img_ext))
        # Move Label
        shutil.move(os.path.join(labels_dir, f + '.txt'), 
                    os.path.join(root_dir, split_name, 'labels', f + '.txt'))

move_files(train_files, 'train')
move_files(val_files, 'val')

# Clean up original folders
os.rmdir(images_dir)
os.rmdir(labels_dir)

print(f"Split complete: {len(train_files)} images in train, {len(val_files)} in val.")