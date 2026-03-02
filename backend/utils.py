import cv2
from ultralytics import YOLO
import re
import numpy as np
import requests
from matplotlib import pyplot as plt
import os
from collections import Counter
import image_processor

model = YOLO("best.pt")

VALID_CLASSES = [
        'cucumber', 'curry', 'dal', 'onion', 'raita',
        'rice', 'chapati', 'sabzi', 'salad', 'sweet', 'tomato'
    ]


class Process_order:
    def __init__(self):
        
        pass

    def fetch_data(order_id):

        order_details = {'order_items_description' : "1 Veg Curry, Rice, Dal, Cut Salad",

                         'image_path' : 'https://api.mealawe.com/images/fdd13fa808f549298055cbd28568be10.jpg'}
        
        return order_details
    
    def save_image(image, filename):
        """
        Save OpenCV image (numpy array) into results folder.
        """

        # 1️ Create folder if not exists
        os.makedirs("results", exist_ok=True)

        # 2️ Create full path
        file_path = os.path.join("results", filename)

        # 3️ Save image
        cv2.imwrite(file_path, image)

        return file_path


    def load_image_from_url(image_url):
        
        response = requests.get(image_url)
        response.raise_for_status()  # Raise error if failed

        # Convert to numpy array
        image_array = np.asarray(bytearray(response.content), dtype=np.uint8)

        # Decode into OpenCV format
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        return image

        
    def predict(image_url:str):

        
        image = Process_order.load_image_from_url(image_url)

        is_good, blur, contrast, texture, lighting_diff, bottom_variance = image_processor.check_image_quality(image)

        if not is_good:
            print("\nImage Quality:")
            print("Blur:", blur)
            print("Contrast:", contrast)
            print("Texture:", texture)
            print("Lighting Diff:", lighting_diff)
            print("Bottom Noise:", bottom_variance)

            image = image_processor.process_image(image)

        results = model.predict(source=image, conf=0.50, save=False)

        detections = []

        for result in results:

            for box in result.boxes:

                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = model.names[class_id]
                if(class_name == 'Roti') :
                    class_name = 'Chapati'

                x1, y1, x2, y2 = map(float, box.xyxy[0])

                detections.append({
                    "class": class_name,
                    "confidence": confidence,
                    "bbox": [x1, y1, x2, y2]
                })

        return detections, image
        
    
    def parse_order(order_data):
        """
        Parses order description into structured dictionary
        using keyword matching instead of mapping.
        """

        description = order_data.get("order_items_description", "").lower()
        result = {}
        #print(f"descp : {description}")
        # Define allowed keywords
        keywords = VALID_CLASSES.copy()
        #print(f"keywords : {keywords}")
        # Step 1: Split by comma
        items = description.split(",")

        for item in items:
            item = item.strip()
            #print(f"item : {item}")
            # Step 2: Extract quantity
            number_match = re.search(r'\d+', item)
            if  number_match:
                
                quantity = int(number_match.group())
            else:
                quantity = 1

            #print(f"Quantity of {item} = {quantity}")

            # Step 3: Extract text (remove number)
            text_part = re.sub(r'\d+', '', item).strip()
            # print(f"text part: {text_part}")

            # Step 4: Match keyword
            for keyword in keywords:
                if keyword in text_part:
                    print(f"{text_part} : {keyword}")
                    result[keyword] = result.get(keyword, 0) + quantity
                    break

        return result

    def parse_detections(detections):

        filtered = [
            d["class"].lower()
            for d in detections
        ]
        
        return dict(Counter(filtered)) 

    def compare_order_and_detection(order_dict, detected_dict):

        response_messages = []
        overall_status = "PASSED"

        all_items = set(order_dict.keys()) | set(detected_dict.keys())

        for item in all_items:
            expected_qty = order_dict.get(item, 0)
            detected_qty = detected_dict.get(item, 0)

            if expected_qty > detected_qty:
                overall_status = "FAILED"
                response_messages.append(
                    f"{item} is missing. Expected {expected_qty}, but detected {detected_qty}."
                )

            elif detected_qty > expected_qty:
                overall_status = "FAILED"
                response_messages.append(
                    f"{item} is extra. Expected {expected_qty}, but detected {detected_qty}."
                )

        if overall_status == "PASSED":
            response_messages.append("All items are correctly packed.")

        return {
            "status": overall_status,
            "messages": response_messages
        } 

    def bboxes(image , detections : list): # code to create bounding boxes over the image using the predictions from model
       
        """
        Draw bounding boxes on image.

        Args:
            image url : url of original image
            detections (list): List of dicts with keys:
                            'class', 'confidence', 'bbox'

        Returns:
            annotated_image
        """

        
        annotated_image = image.copy()

        for det in detections:

            x1, y1, x2, y2 = map(int, det["bbox"])
            label = det["class"]
            confidence = det["confidence"]

            # Draw rectangle
            cv2.rectangle(
                annotated_image,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),  # Green box
                2
            )

            # Label text
            text = f"{label} {confidence:.2f}"

            # Text background
            (text_width, text_height), _ = cv2.getTextSize(
                text,
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                1
            )

            cv2.rectangle(
                annotated_image,
                (x1, y1 - text_height - 5),
                (x1 + text_width, y1),
                (0, 255, 0),
                -1
            )

            # Put text
            cv2.putText(
                annotated_image,
                text,
                (x1, y1 - 3),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 0),
                1
            )

        return annotated_image
