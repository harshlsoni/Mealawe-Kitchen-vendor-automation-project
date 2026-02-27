from utils import Process_order
import utils
from matplotlib import pyplot as plt
import cv2
import os

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import base64
import cv2

def save_image(image, filename):
    """
    Save OpenCV image (numpy array) into results folder.
    """

    # 1️⃣ Create folder if not exists
    os.makedirs("results", exist_ok=True)

    # 2️⃣ Create full path
    file_path = os.path.join("results", filename)

    # 3️⃣ Save image
    cv2.imwrite(file_path, image)

    return file_path

app = FastAPI()

@app.post("/verify-order")
async def verify_order():

    try:
        # 1️⃣ Fetch order data
        order_data = Process_order.fetch_data()

        image_url = order_data["image_path"]
        description = order_data["order_items_description"]

        # 2️⃣ Predict detections
        detections = Process_order.predict(utils.model_path,utils.image_path)

        # 3️⃣ Parse detections
        detections_dict = Process_order.parse_detections(detections)

        # 4️⃣ Parse order text
        order_items_dict = {'roti' : 2 , 'rice' : 1, 'dal' : 1}

        # 5️⃣ Compare
        text_response = Process_order.compare_order_and_detection(
            order_items_dict,
            detections_dict
        )

        # 6️⃣ Annotate Image
        annotated_img = Process_order.bboxes(utils.image_path, detections)

        saved_path = save_image(annotated_img, "order_123.jpg")

        print(f"path : {saved_path}")


        # 7️⃣ Convert image to base64
        _, buffer = cv2.imencode(".jpg", annotated_img)
        img_base64 = base64.b64encode(buffer).decode("utf-8")

        return JSONResponse(
            content={
                "verification_result": text_response,
                'original_order_list' : order_items_dict,
                "annotated_image_base64": img_base64
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))