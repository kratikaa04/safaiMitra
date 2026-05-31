const CityStats = require("../models/CityStats");

/**
 * Upserts city totals and recalculates rank positions for all cities.
 * Called automatically after every new waste entry is saved.
 */
async function updateCityStats(city, weightKg, points) {
  // Upsert this city's running totals
  await CityStats.findOneAndUpdate(
    { city },
    {
      $inc: {
        totalKg: weightKg,
        points: points,
        entryCount: 1,
      },
    },
    { upsert: true, new: true }
  );

  // Re-rank all cities by totalKg descending
  const allCities = await CityStats.find().sort({ totalKg: -1 });
  const bulkOps = allCities.map((c, index) => ({
    updateOne: {
      filter: { _id: c._id },
      update: { $set: { rank: index + 1 } },
    },
  }));

  if (bulkOps.length > 0) {
    await CityStats.bulkWrite(bulkOps);
  }
}

module.exports = { updateCityStats };
