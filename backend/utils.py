import cv2
from ultralytics import YOLO
from rapidfuzz import process, fuzz
import re
from collections import Counter
from collections import defaultdict

model_path = "E:/Mealawe-Kitchen-vendor-automation-project/model_training_and_evaluation/runs/detect/Mealawe_model_version1/v023/weights/best.pt"
image_path = "E:/Mealawe-Kitchen-vendor-automation-project/model_training_and_evaluation/dataset/test/images/249_jpg.rf.172f0602bb179a2485400675efa04718.jpg"
VALID_CLASSES = [
        'Cucumber', 'Curry', 'Dal', 'Onion', 'Raita',
        'Rice', 'Roti', 'Sabzi', 'Salad', 'Sweet', 'Tomato'
    ]


class Process_order:
    def __init__(self):
        
        pass

    def fetch_data():

        order_details = {'order_items_description' : '3 Chapati, 1 Veg Curry, Cut Salad',
                         'image_path' : 'https://api.mealawe.com/images/fff6645dfea94d02955619b7090f2a09.jpg'}
        
        return order_details
        
    def predict(model_path:str,image_path:str):

        model = YOLO(model_path)

        image = cv2.imread(image_path)

        results = model.predict(source=image, conf=0.50, save=False)

        detections = []

        for result in results:

            for box in result.boxes:

                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = model.names[class_id]

                x1, y1, x2, y2 = map(float, box.xyxy[0])

                detections.append({
                    "class": class_name,
                    "confidence": confidence,
                    "bbox": [x1, y1, x2, y2]
                })

        return detections
        
    def match_to_class(item_name, threshold=70):
        """
        Match item_name to closest VALID_CLASS using fuzzy matching.
        """

        match, score, _ = process.extractOne(
            item_name,
            VALID_CLASSES,
            scorer=fuzz.token_sort_ratio
        )

        if score >= threshold:
            return match
        else:
            return None

    def description_pattern_matching(description):
        items = description.split(',')
        parsed = defaultdict(int)

        for item in items:
            item = item.strip().lower()

            match = re.match(r"(\d+)\s+(.*)", item)

            if match:
                qty = int(match.group(1))
                name = match.group(2).strip()
            else:
                qty = 1
                name = item

            matched_class = Process_order.match_to_class(name)

            if matched_class:
                parsed[matched_class] += qty

        return dict(parsed)

    def parse_detections(detections, confidence_threshold=0.5):
        filtered = [
            d["class"]
            for d in detections
            if d["confidence"] >= confidence_threshold
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

    def bboxes(image_path:str , detections : list): # code to create bounding boxes over the image using the predictions from model
       
        """
        Draw bounding boxes on image.

        Args:
            image path : path of original image
            detections (list): List of dicts with keys:
                            'class', 'confidence', 'bbox'

        Returns:
            annotated_image
        """

        image = cv2.imread(image_path)
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
