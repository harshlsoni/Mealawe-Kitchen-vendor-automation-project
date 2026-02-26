from utils import Process_order
from matplotlib import pyplot as plt
import cv2
model_path = r"model_training_and_evaluation\\runs\detect\\mealawe_project_vChecking\\yolo11_small4\weights\best.pt"
image_path = r"model_training_and_evaluation\\mealawe_annotation-3\\test\\images\\2326_jpg.rf.40757f23a03537b62d5e2ef8f7fdaced.jpg"
results = Process_order.predict(model_path,image_path)
bboxes_img = Process_order.bboxes(image_path, results)

rgb_img = cv2.cvtColor(bboxes_img, cv2.COLOR_BGR2RGB)

plt.imshow(rgb_img)
plt.show()