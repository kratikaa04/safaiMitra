import tensorflow as tf
import numpy as np
import cv2
import serial
import time
import csv
import requests
import os
import sys
from datetime import datetime
from pathlib import Path

# ============================================================
# CONFIG — Windows-only setup
# ============================================================

BACKEND_URL  = "http://localhost:5000/api/waste/iot"
DEVICE_ID    = "WINDOWS-DUSTBIN-001"
CITY_DEFAULT = "Mumbai"

# Arduino serial port — check Device Manager → Ports
# Set to None to skip Arduino entirely
ARDUINO_PORT = "COM3"   # ← change to your actual port e.g. COM4, COM5, or None

# Camera index: 0 = default webcam, 1 = external USB cam
CAMERA_INDEX = 0

# ============================================================
# Resolve paths relative to this script
# ============================================================

BASE_DIR      = Path(__file__).resolve().parent
MODEL_PATH    = BASE_DIR / "keras" / "keras_model.h5"
LABELS_PATH   = BASE_DIR / "keras" / "labels.txt"
DASHBOARD_CSV = BASE_DIR / "dashboard.csv"

# ============================================================
# Send data to SafaiMitra backend
# ============================================================

def send_to_backend(waste_type, weight_kg, city):
    try:
        payload = {
            "type":      waste_type,
            "weight":    float(weight_kg),
            "city":      city.strip(),
            "deviceId":  DEVICE_ID,
            "timestamp": datetime.now().isoformat(),
        }
        print(f"[NET] Sending payload: {payload}")
        response = requests.post(BACKEND_URL, json=payload, timeout=5)
        print(f"[NET] Response: {response.status_code} — {response.text}")

        if response.status_code == 201:
            points = response.json().get("pointsAwarded", 0)
            print(f"[OK] Backend updated — Points awarded: {points}")
            return points
        else:
            print(f"[WARN] Backend rejected: {response.status_code} — {response.text}")
            return 0

    except requests.exceptions.ConnectionError:
        print("[WARN] Could not reach backend — is it running?")
        print(f"       Tried: {BACKEND_URL}")
        return 0
    except Exception as e:
        print(f"[WARN] Error sending to backend: {e}")
        return 0

# ============================================================
# Load AI model
# ============================================================

if not MODEL_PATH.exists():
    print(f"[ERROR] Model not found: {MODEL_PATH}")
    print("        Make sure keras/keras_model.h5 is next to this script.")
    sys.exit(1)

if not LABELS_PATH.exists():
    print(f"[ERROR] Labels not found: {LABELS_PATH}")
    sys.exit(1)

print("Loading AI model...")
model = tf.keras.models.load_model(str(MODEL_PATH))

with open(LABELS_PATH, "r") as f:
    labels = [line.strip() for line in f.readlines()]

print(f"[OK] Model loaded — {len(labels)} classes: {labels}")

# ============================================================
# Connect Arduino (optional)
# ============================================================

arduino_connected = False

if ARDUINO_PORT:
    try:
        arduino = serial.Serial(ARDUINO_PORT, 9600, timeout=1)
        time.sleep(2)
        arduino_connected = True
        print(f"[OK] Arduino connected on {ARDUINO_PORT}")
    except Exception as e:
        print(f"[WARN] Arduino not connected ({e}) — continuing without hardware")
else:
    print("[INFO] ARDUINO_PORT is None — skipping hardware")

# ============================================================
# Start camera
# ============================================================

cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)

if not cap.isOpened():
    cap = cv2.VideoCapture(CAMERA_INDEX)

if not cap.isOpened():
    print(f"[ERROR] Camera index {CAMERA_INDEX} not found.")
    print("        Try changing CAMERA_INDEX to 1 or 2 at the top of this file.")
    sys.exit(1)

print(f"[OK] Camera started (index {CAMERA_INDEX})")

# Flush first 30 frames so camera adjusts exposure and brightness
print("[...] Camera warming up, please wait...")
for _ in range(30):
    cap.read()
print("[OK] Camera ready")

# ============================================================
# Prepare local CSV backup
# ============================================================

write_header = not DASHBOARD_CSV.exists()

with open(DASHBOARD_CSV, mode="a", newline="", encoding="utf-8") as f:
    if write_header:
        csv.writer(f).writerow(
            ["Name", "City", "Waste Type", "Weight(kg)", "Reward", "Backend Sent", "Time"]
        )

# ============================================================
# User details
# ============================================================

print("\n===== SAFAIMITRA SMART DUSTBIN =====")
name = input("Enter your name: ").strip() or "User"
city = input("Enter your city (Mumbai / Delhi / Pune / Chennai / Bengaluru): ").strip() or CITY_DEFAULT

print(f"\nWelcome {name} from {city}!")
print("Camera is live. Place waste in the green box and press SPACE to detect.\n")

# ============================================================
# Main camera loop
# ============================================================

while True:
    ret, frame = cap.read()

    if not ret:
        print("[WARN] Frame read failed — check your camera.")
        break

    frame = cv2.flip(frame, 1)
    h, w  = frame.shape[:2]

    x1, y1 = int(w * 0.3), int(h * 0.2)
    x2, y2 = int(w * 0.7), int(h * 0.8)

    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 3)

    cv2.putText(frame, "SAFAIMITRA SMART DUSTBIN",    (20, 40),      cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
    cv2.putText(frame, "PLACE WASTE IN GREEN BOX",    (x1, y1 - 20),cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0),     2)
    cv2.putText(frame, f"User: {name}",               (20, 80),      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cv2.putText(frame, f"City: {city}",               (20, 120),     cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cv2.putText(frame, "SPACE = detect  |  Q = quit", (20, h - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255),   2)

    cv2.imshow("SafaiMitra Smart Dustbin", frame)

    key = cv2.waitKey(1) & 0xFF

    # ── SPACE: detect waste ───────────────────────────────────
    if key == 32:

        print("\n--- Detection started ---")

        # Grab 5 fresh frames so the captured image is current
        for _ in range(5):
            ret, frame = cap.read()
        frame = cv2.flip(frame, 1)

        # Crop detection zone
        roi       = frame[y1:y2, x1:x2]
        img       = cv2.resize(roi, (224, 224))
        img_array = np.asarray(img, dtype=np.float32) / 255.0
        img_array = np.reshape(img_array, (1, 224, 224, 3))

        # Predict
        prediction = model.predict(img_array, verbose=0)
        class_name = labels[int(np.argmax(prediction))]
        confidence = float(np.max(prediction)) * 100

        print(f"Detected: {class_name}  (confidence {confidence:.1f}%)")

        # Map label → SafaiMitra waste type
        # Checks "non" FIRST because "non biodegradable" also contains "bio"
        label_lower = class_name.lower()
        if "non" in label_lower:
            safaimitra_type = "Recyclable"
            arduino_signal  = b"N"
            weight_kg       = 0.5
            color           = (0, 0, 255)
        elif "bio" in label_lower:
            safaimitra_type = "Organic"
            arduino_signal  = b"B"
            weight_kg       = 0.5
            color           = (0, 255, 0)
        else:
            safaimitra_type = "Recyclable"
            arduino_signal  = b"N"
            weight_kg       = 0.5
            color           = (0, 0, 255)

        print(f"Mapped type: {safaimitra_type}")

        # Arduino signal
        if arduino_connected:
            try:
                arduino.write(arduino_signal)
                print(f"[HW] Arduino signal sent: {arduino_signal.decode()}")
            except Exception as e:
                print(f"[WARN] Arduino write failed: {e}")

        # Send to backend
        print("[NET] Sending to SafaiMitra backend...")
        points = send_to_backend(safaimitra_type, weight_kg, city)
        reward = points if points > 0 else (10 if safaimitra_type == "Organic" else 5)

        # CSV backup
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        backend_sent = "Yes" if points > 0 else "No (offline)"

        with open(DASHBOARD_CSV, mode="a", newline="", encoding="utf-8") as f:
            csv.writer(f).writerow(
                [name, city, safaimitra_type, weight_kg, reward, backend_sent, current_time]
            )

        print(f"Reward earned: {reward} points")
        print(f"CSV saved to:  {DASHBOARD_CSV}")
        print("--- Detection complete — press SPACE for next item ---\n")

        # Show result overlay for 4 seconds then return to camera
        result_frame = frame.copy()
        cv2.putText(result_frame, safaimitra_type,                   (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color,           4)
        cv2.putText(result_frame, f"Confidence: {confidence:.1f}%", (50, 260), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.putText(result_frame, f"Reward: {reward} pts",          (50, 320), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 3)
        cv2.putText(result_frame, f"Backend: {backend_sent}",       (50, 390), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255),   2)
        cv2.putText(result_frame, "Dashboard Updated!",              (50, 460), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 0),   3)

        cv2.imshow("SafaiMitra Smart Dustbin", result_frame)
        cv2.waitKey(4000)
        # NO break here — loops back to camera for next detection

    # ── Q: quit ───────────────────────────────────────────────
    if key == ord("q"):
        print("Quitting...")
        break

# ============================================================
# Cleanup
# ============================================================

cap.release()
cv2.destroyAllWindows()

if arduino_connected:
    arduino.close()

print("\nThank you for keeping the city clean!")
