# SafaiMitra
### AI-Powered Smart Waste Management System

SafaiMitra is a smart waste management system that uses artificial intelligence to detect and classify waste in real time, automatically sort it using hardware, reward users for responsible disposal, and display live data on an interactive dashboard.

---

## How It Works

1. **Waste Detection** — A laptop camera captures the waste item and a trained AI model classifies it as biodegradable or non-biodegradable in real time.
2. **Smart Sorting** — An Arduino-controlled servo motor physically sorts the waste into the correct bin based on the classification.
3. **Reward System** — Every disposal is logged and reward points are automatically calculated based on waste type and weight.
4. **Live Dashboard** — A React-based web dashboard displays real-time disposal activity, reward points, and city-level waste insights.

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI & Detection | Python, TensorFlow, OpenCV |
| Hardware | Arduino, Servo Motor |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Frontend | React, Vite |

---

## Project Structure
safaiMitra/
├── backend/      # Node.js + Express REST API
├── frontend/     # React dashboard (Vite)
└── iot/          # Python AI detection module + Arduino code

---

## Features

- Real-time waste classification using a trained Keras model
- Arduino servo motor integration for physical waste sorting
- REST API with automated point calculation
- City-level leaderboard and disposal history
- Offline fallback with local CSV logging
- Modular architecture ready for IoT hardware scaling

---

## Getting Started

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### IoT Module
```bash
cd iot
pip install -r requirements.txt
python smartDustbin.py
```

---

## Future Scope

- Integration with real smart bins and weight sensors
- GPS-based waste collection route optimization
- Mobile application for citizens
- City administration analytics panel
- Large-scale smart city deployment

---

*Built with the goal of making cities cleaner, smarter, and more sustainable.*

