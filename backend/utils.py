import cv2
from ultralytics import YOLO

class Process_order:
    def __init__(self):
        
        pass

    def fetch_data():
        pass

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
        

    def order_mapping():
        pass

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
