const express = require("express");
const Weather = require("../models/weather");

const weatherRouter = express.Router();

weatherRouter.get("/api/weather", async (req, res, next) => {
    try {
        const weatherData = await Weather.find();
        res.json(weatherData);
      } catch (err) {
        res.status(500).send(err);
      }
});

module.exports = weatherRouter;