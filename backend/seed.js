/**
 * SafaiMitra — Database Seed Script
 * Run once with: node seed.js
 * Populates MongoDB with the original mock data so the frontend
 * displays the same content it showed with hardcoded arrays.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const WasteEntry = require("./models/WasteEntry");
const CityStats = require("./models/CityStats");
const User = require("./models/User");

const wasteEntries = [
  { type: "Recyclable", weight: 1.2, city: "Mumbai", status: "Collected", source: "manual" },
  { type: "Organic",    weight: 0.8, city: "Delhi",  status: "Collected", source: "manual" },
  { type: "E-Waste",   weight: 2.1, city: "Mumbai", status: "Pending",   source: "iot"    },
  { type: "Recyclable", weight: 0.5, city: "Pune",   status: "Collected", source: "manual" },
  { type: "Hazardous", weight: 0.3, city: "Delhi",  status: "Collected", source: "manual" },
  { type: "Organic",    weight: 1.5, city: "Chennai",status: "Pending",   source: "manual" },
  { type: "Recyclable", weight: 0.9, city: "Pune",   status: "Collected", source: "manual" },
];

const cityStats = [
  { city: "Mumbai",    totalKg: 48.2, points: 482, rank: 1, change: 5  },
  { city: "Delhi",     totalKg: 41.7, points: 397, rank: 2, change: -1 },
  { city: "Pune",      totalKg: 35.1, points: 321, rank: 3, change: 2  },
  { city: "Chennai",   totalKg: 29.6, points: 278, rank: 4, change: 0  },
  { city: "Bengaluru", totalKg: 22.4, points: 201, rank: 5, change: 3  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing data
  await WasteEntry.deleteMany();
  await CityStats.deleteMany();
  await User.deleteMany();
  console.log("🗑  Cleared existing data");

  // Insert waste entries (points auto-calculated by pre-save hook)
  const insertedEntries = await WasteEntry.insertMany(wasteEntries);
  console.log(`📦 Inserted ${insertedEntries.length} waste entries`);

  // Insert city stats
  await CityStats.insertMany(cityStats);
  console.log(`🏙  Inserted ${cityStats.length} city records`);

  // Create a demo user
  await User.create({
    name: "John Doe",
    email: "john.doe@safaimitra.app",
    password: "password123",
    city: "Mumbai",
    role: "user",
    totalPoints: 74,
  });

  // Create an admin user
  await User.create({
    name: "Admin",
    email: "admin@safaimitra.app",
    password: "admin123",
    city: "Mumbai",
    role: "admin",
    totalPoints: 0,
  });

  console.log("👤 Created demo users (john.doe@safaimitra.app / password123)");
  console.log("🔑 Created admin user (admin@safaimitra.app / admin123)");
  console.log("\n✅ SafaiMitra database seeded successfully!");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
