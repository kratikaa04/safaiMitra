const express = require("express");
const router = express.Router();
const WasteEntry = require("../models/WasteEntry");
const User = require("../models/User");
const { updateCityStats } = require("../utils/cityStats");

// ── GET /api/waste ──────────────────────────────────────────────────────────
// Returns all waste entries, newest first (what the frontend fetches)
router.get("/", async (req, res) => {
  try {
    const entries = await WasteEntry.find().sort({ createdAt: -1 }).lean();

    // Shape response to match frontend expectations
    const shaped = entries.map((e, i) => ({
      id: e._id,
      type: e.type,
      weight: e.weight,
      points: e.points,
      date: e.createdAt.toISOString().split("T")[0],
      city: e.city,
      status: e.status,
    }));

    res.json(shaped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/waste ─────────────────────────────────────────────────────────
// Manual entry from frontend form OR IoT device push
router.post("/", async (req, res) => {
  try {
    const { type, weight, city, status, source, userId } = req.body;

    const entry = new WasteEntry({ type, weight, city, status, source, userId });
    await entry.save(); // points auto-calculated in pre-save hook

    // Update city aggregate stats
    await updateCityStats(city, entry.weight, entry.points);

    // Update user's total points if userId provided
    if (userId) {
      await User.findByIdAndUpdate(userId, { $inc: { totalPoints: entry.points } });
    }

    res.status(201).json({
      id: entry._id,
      type: entry.type,
      weight: entry.weight,
      points: entry.points,
      date: entry.createdAt.toISOString().split("T")[0],
      city: entry.city,
      status: entry.status,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── POST /api/waste/iot ─────────────────────────────────────────────────────
// Dedicated endpoint for IoT device / detection module (laptop simulation or ESP32)
// Accepts: { type, weight, city, deviceId, timestamp }
router.post("/iot", async (req, res) => {
  try {
    const { type, weight, city, deviceId, timestamp } = req.body;

    if (!type || !weight || !city) {
      return res.status(400).json({ error: "type, weight and city are required" });
    }

    const entry = new WasteEntry({
      type,
      weight: parseFloat(weight),
      city,
      status: "Collected",
      source: "iot",
    });
    await entry.save();

    await updateCityStats(city, entry.weight, entry.points);

    console.log(`📡 IoT entry received from device [${deviceId || "unknown"}]: ${type} | ${weight}kg | ${city}`);

    res.status(201).json({
      success: true,
      entryId: entry._id,
      pointsAwarded: entry.points,
      message: `Logged ${weight}kg of ${type} waste from ${city}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/waste/:id/status ─────────────────────────────────────────────
// Update collection status (Pending → Collected)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const entry = await WasteEntry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    res.json({ id: entry._id, status: entry.status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── GET /api/waste/stats ────────────────────────────────────────────────────
// Summary stats for dashboard cards
router.get("/stats", async (req, res) => {
  try {
    const [totalEntries, totalWeight, totalPoints, pendingCount] = await Promise.all([
      WasteEntry.countDocuments(),
      WasteEntry.aggregate([{ $group: { _id: null, total: { $sum: "$weight" } } }]),
      WasteEntry.aggregate([{ $group: { _id: null, total: { $sum: "$points" } } }]),
      WasteEntry.countDocuments({ status: "Pending" }),
    ]);

    res.json({
      totalEntries,
      totalWeightKg: totalWeight[0]?.total?.toFixed(2) || "0.00",
      totalPoints: totalPoints[0]?.total || 0,
      pendingCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
