/**
 * SafaiMitra — IoT Detection Module Simulator
 * Run with: node iot-simulator.js
 *
 * Simulates the laptop-based waste detection module (standing in for an ESP32)
 * that sends detected waste data to the backend every few seconds.
 * In production, replace this with your actual AI detection module output.
 */

const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000";

const WASTE_TYPES = ["Recyclable", "Organic", "E-Waste", "Hazardous", "General"];
const CITIES = ["Mumbai", "Delhi", "Pune", "Chennai", "Bengaluru"];
const DEVICE_ID = "SIM-LAPTOP-001";

function randomBetween(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function sendWasteDetection() {
  const payload = {
    type: randomFrom(WASTE_TYPES),
    weight: randomBetween(0.1, 3.0),
    city: randomFrom(CITIES),
    deviceId: DEVICE_ID,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${BASE_URL}/api/waste/iot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(
        `✅ [${new Date().toLocaleTimeString()}] Sent: ${payload.type} | ${payload.weight}kg | ${payload.city} → Points: ${data.pointsAwarded}`
      );
    } else {
      console.error(`❌ Server error: ${data.error}`);
    }
  } catch (err) {
    console.error(`❌ Connection failed: ${err.message} — Is the backend running?`);
  }
}

// Send a detection every 5 seconds
const INTERVAL_MS = 5000;
console.log(`🤖 SafaiMitra IoT Simulator started (Device: ${DEVICE_ID})`);
console.log(`📡 Sending detections to ${BASE_URL}/api/waste/iot every ${INTERVAL_MS / 1000}s\n`);

sendWasteDetection(); // send immediately on start
setInterval(sendWasteDetection, INTERVAL_MS);
