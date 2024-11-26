import face_recognition
import os
import sys
import cv2
import numpy as np
import math
import requests
from datetime import datetime
import time
import threading

def face_confidence(face_distance, face_match_threshold=0.6):
    range = (1.0 - face_match_threshold)
    linear_val = (1.0 - face_distance) / (range * 2.0)

    if face_distance > face_match_threshold:
        return str(round(linear_val * 100, 2)) + '%'
    else:
        value = (linear_val + ((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))) * 100
        return str(round(value, 2)) + '%'


class FaceRecognition:
    face_locations = []
    face_encodings = []
    face_names = []
    known_face_encodings = []
    known_face_names = []
    process_current_frame = True
    count_names = []

    def __init__(self):
        self.encode_faces()

    def encode_faces(self):
        for image in os.listdir('faces'):
            face_image = face_recognition.load_image_file(f"faces/{image}")
            face_encoding = face_recognition.face_encodings(face_image)
            if len(face_encoding) > 0:
                self.known_face_encodings.append(face_encoding[0])
                self.known_face_names.append(os.path.splitext(image)[0])
            else:
                print(f"Warning: No face detected in {image}. Please check the image quality.")

        if len(self.known_face_encodings) == 0:
            print("Warning: No faces found in the 'faces' directory. Make sure to add known faces for recognition.")

    def run_recognition(self):
        video_capture = cv2.VideoCapture(0)

        if not video_capture.isOpened():
            sys.exit('Video source not found...')

        while True:
            ret, frame = video_capture.read()

            if not ret:
                print("Failed to capture frame from camera. Retrying...")
                continue  # If the frame isn't captured properly, retry

            if self.process_current_frame:
                # Resize frame for faster processing
                small_frame = cv2.resize(frame, (0, 0), fx=0.75, fy=0.75)  # Increased scaling factor
                rgb_small_frame = small_frame[:, :, ::-1]

                # Find all face locations and face encodings in the current frame
                self.face_locations = face_recognition.face_locations(rgb_small_frame)
                print(f"Face locations: {self.face_locations}")

                if len(self.face_locations) == 0:
                    print('No faces detected in this frame.')

                self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)
                if len(self.face_encodings) == 0:
                    print("No encodings found for detected faces. Make sure the camera captures a clear view of your face.")

                self.face_names = []
                for face_encoding in self.face_encodings:
                    print('Processing detected face...')
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                    name = "Unknown"
                    confidence = '???'

                    if len(self.known_face_encodings) > 0:
                        face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            name = self.known_face_names[best_match_index]
                            confidence = face_confidence(face_distances[best_match_index])
                            self.face_names.append(f'{name} ({confidence})')
                            # Make API request when face is recognized with high confidence
                            if float(confidence.strip('%')) > 90:
                                if(name not in self.count_names):
                                    threading.Thread(target=self.make_api_request, args=(name,)).start()
                                    self.count_names.append(name)
                                else:
                                    self.face_names.append(f'{name} ({confidence})')
                            else:
                                self.face_names.append(f'{name} ({confidence})')
                        else:
                            self.face_names.append(f'{name} ({confidence})')
                    else:
                        print("No known faces to compare.")

            self.process_current_frame = not self.process_current_frame

            # Draw rectangles around detected faces
            for (top, right, bottom, left), name in zip(self.face_locations, self.face_names):
                top *= int(1 / 0.75)  # Adjust back to the original frame size
                right *= int(1 / 0.75)
                bottom *= int(1 / 0.75)
                left *= int(1 / 0.75)

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)

            # Show the video feed
            cv2.imshow('Face Recognition', frame)

            # Wait for 'q' key to quit the application
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        # Release the camera and close all windows
        video_capture.release()
        cv2.destroyAllWindows()

    def make_api_request(self, name):
        url = "http://localhost:3300/api/Prepared"
        payload = {
            "name": name,
            "time": datetime.now().isoformat()
        }
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                print(f"Successfully sent data for {name}")
            else:
                print(f"Failed to send data for {name}: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error sending data: {e}")


if __name__ == '__main__':
    fr = FaceRecognition()
    fr.run_recognition()
