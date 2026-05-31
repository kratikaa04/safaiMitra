const mongoose = require("mongoose");

const cityStatsSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true, trim: true },
    totalKg: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    change: { type: Number, default: 0 }, // rank change vs previous week
    entryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CityStats", cityStatsSchema);
