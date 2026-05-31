const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const wasteRoutes = require("./routes/waste");
const cityRoutes  = require("./routes/cities");
const authRoutes  = require("./routes/auth");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
// Accept requests from the Vite dev server AND from localhost directly
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, Python requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/waste",  wasteRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/auth",   authRoutes);

// Health check
app.get("/api/health", (_req, res) =>
  res.json({ status: "SafaiMitra backend is running", time: new Date().toISOString() })
);

// ── Database → Server ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    // Listen on all interfaces so the Python script can reach it via localhost
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 SafaiMitra backend running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("   Is MongoDB running? Start it with: mongod");
    process.exit(1);
  });
