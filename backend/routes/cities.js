const express = require("express");
const router = express.Router();
const CityStats = require("../models/CityStats");

// ── GET /api/cities ─────────────────────────────────────────────────────────
// Returns all cities sorted by rank (what the frontend CityRankingPage fetches)
router.get("/", async (req, res) => {
  try {
    const cities = await CityStats.find().sort({ rank: 1 }).lean();

    // Shape to match frontend expectations exactly
    const shaped = cities.map((c) => ({
      city: c.city,
      totalKg: parseFloat(c.totalKg.toFixed(1)),
      points: c.points,
      rank: c.rank,
      change: c.change,
    }));

    res.json(shaped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/cities/:cityName ───────────────────────────────────────────────
// Single city detail
router.get("/:cityName", async (req, res) => {
  try {
    const city = await CityStats.findOne({
      city: new RegExp(`^${req.params.cityName}$`, "i"),
    });
    if (!city) return res.status(404).json({ error: "City not found" });
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
