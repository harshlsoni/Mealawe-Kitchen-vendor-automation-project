from utils import Process_order
import utils
from matplotlib import pyplot as plt
import cv2
import os
from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.responses import JSONResponse # type: ignore
import base64


app = FastAPI()

@app.get("/verify-order/{order_id}")
async def verify_order(order_id):

    try:
        # 1️ Fetch order data
        order_data = Process_order.fetch_data(order_id)

        image_url = order_data["image_path"]

        # 2️ Predict detections
        detections = Process_order.predict(utils.model_path,image_url)

        # 3️ Parse detections
        detections_dict = Process_order.parse_detections(detections)

        # 4️ Parse order text
        order_items_dict = Process_order.parse_order(order_data)

        # 5️ Compare
        text_response = Process_order.compare_order_and_detection(
            order_items_dict,
            detections_dict
        )

        # 6️ Annotate Image
        annotated_img = Process_order.bboxes(image_url, detections)

        saved_path = Process_order.save_image(annotated_img, "order_123.jpg")

        print(f"path : {saved_path}")


        """
        # 7️ Convert image to base64
        _, buffer = cv2.imencode(".jpg", annotated_img)
        img_base64 = base64.b64encode(buffer).decode("utf-8")
        """

        return JSONResponse(
            content={
                "verification_result": text_response,
                'original_order_list' : order_items_dict
                #"annotated_image_base64": img_base64
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))