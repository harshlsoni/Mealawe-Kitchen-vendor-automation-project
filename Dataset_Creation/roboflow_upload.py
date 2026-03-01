import os
from roboflow import Roboflow

# Initialize Roboflow
rf = Roboflow(api_key="api key")

workspace_id = "abc-6ewki"
project_id = "mealawe_annotation"

project = rf.workspace(workspace_id).project(project_id)

# Folder containing your images
IMAGE_FOLDER = r"--------------------------------"

# Allowed image extensions
VALID_EXTS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")

uploaded = 0

for filename in os.listdir(IMAGE_FOLDER):
    if filename.lower().endswith(VALID_EXTS):
        image_path = os.path.join(IMAGE_FOLDER, filename)

        print(f"Uploading → {filename}")

        project.upload(
            image_path=image_path, 
            num_retry_uploads=3
        )

        uploaded += 1

print(f"\n✅ Uploaded {uploaded} images successfully!")
