import cv2
import numpy as np


# -------- IMAGE QUALITY CHECK --------
def check_image_quality(img):

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    h, w = gray.shape

    # ---- 1. Blur ----
    blur = cv2.Laplacian(gray, cv2.CV_64F).var()

    # ---- 2. Contrast ----
    contrast = gray.std()

    # ---- 3. Texture strength ----
    sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0)
    sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1)
    texture = np.mean(np.sqrt(sobelx**2 + sobely**2))

    # ---- 4. Lighting imbalance ----
    top = np.mean(gray[:h//2, :])
    bottom = np.mean(gray[h//2:, :])
    lighting_diff = abs(top - bottom)

    # ---- 5. Timestamp obstruction check ----
    bottom_crop = gray[int(h*0.8):h, :]
    bottom_variance = bottom_crop.std()

    # -------- DECISION --------
    is_good = True

    if blur < 150:
        is_good = False

    if contrast < 45:
        is_good = False

    if texture < 12:
        is_good = False

    if lighting_diff > 35:
        is_good = False

    if bottom_variance > 55:   # detects text overlay
        is_good = False

    return is_good, blur, contrast, texture, lighting_diff, bottom_variance



# -------- APPLY PROCESSING --------
def process_image(img):

    # ---- 1. Slight denoise ----
    denoised = cv2.GaussianBlur(img, (3,3), 0)

    # ---- 2. Light contrast stretch instead of CLAHE ----
    img_float = denoised.astype(np.float32)

    min_val = np.percentile(img_float, 2)
    max_val = np.percentile(img_float, 98)

    stretched = (img_float - min_val) * (255 / (max_val - min_val))
    stretched = np.clip(stretched, 0, 255).astype(np.uint8)

    # ---- 3. Very light sharpening ----
    kernel = np.array([[0,-1,0],
                       [-1,5,-1],
                       [0,-1,0]])

    sharpened = cv2.filter2D(stretched, -1, kernel)

    # ---- 4. Reduce timestamp impact (soft bottom blur) ----
    h, w, _ = sharpened.shape
    bottom = sharpened[int(h*0.85):h, :]

    bottom = cv2.GaussianBlur(bottom, (9,9), 0)
    sharpened[int(h*0.85):h, :] = bottom
    return sharpened