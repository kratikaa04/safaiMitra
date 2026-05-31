const mongoose = require("mongoose");

// Points are auto-calculated based on waste type and weight
// Recyclable: 10pts/kg | Organic: 8pts/kg | E-Waste: 15pts/kg | Hazardous: 20pts/kg | General: 5pts/kg
const POINTS_PER_KG = {
  Recyclable: 10,
  Organic: 8,
  "E-Waste": 15,
  Hazardous: 20,
  General: 5,
};

const wasteEntrySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Recyclable", "Organic", "E-Waste", "Hazardous", "General"],
    },
    weight: {
      type: Number,
      required: true,
      min: 0.01,
    },
    points: {
      type: Number,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Collected", "Pending", "Processing"],
      default: "Pending",
    },
    // Simulated IoT device / detection source
    source: {
      type: String,
      default: "manual", // "iot" | "manual" | "simulation"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-calculate points before saving
wasteEntrySchema.pre("save", function (next) {
  if (!this.points) {
    const rate = POINTS_PER_KG[this.type] || 5;
    this.points = Math.round(this.weight * rate);
  }
  next();
});

// Virtual: formatted date string for frontend
wasteEntrySchema.virtual("date").get(function () {
  return this.createdAt.toISOString().split("T")[0];
});

wasteEntrySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("WasteEntry", wasteEntrySchema);
