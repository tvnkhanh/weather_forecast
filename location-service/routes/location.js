const dotenv = require("dotenv");
const express = require("express");
const auth = require("../middleware/auth");

const Location = require("../models/location");

dotenv.config();

const locationRouter = express.Router();

locationRouter.get("/api/locations/user/:userId", auth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const locations = await Location.find({ userId });
    res.json(locations);
  } catch (err) {
    res.status(500).send(err);
  }
});

locationRouter.post("/api/create-location", auth, async (req, res, next) => {
  try {
    const { userId, city } = req.body;
    let existingLocation = await Location.findOne({ userId });

    if (existingLocation) {
      const cityIndex = existingLocation.cities.indexOf(city);
      if (cityIndex === -1) {
        existingLocation.cities.push(city);
      } else {
        existingLocation.cities.splice(cityIndex, 1);
      }

      existingLocation = await existingLocation.save();

      return res.json(existingLocation);
    }

    const newLocation = new Location({
      userId,
      cities: [city], 
    });

    await newLocation.save();

    res.json(newLocation);
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = locationRouter;
