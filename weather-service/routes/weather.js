const dotenv = require('dotenv');
const express = require("express");
const axios = require('axios');

dotenv.config();

const weatherRouter = express.Router();

const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const GEO_API_HEADERS = {
  'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
  'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
};
const API_KEY = process.env.API_KEY;

weatherRouter.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(`${WEATHER_API_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: 'metric',
        },
      }),
      axios.get(`${WEATHER_API_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: 'metric',
        },
      }),
    ]);

    res.json({
      weatherData: weatherResponse.data,
      forecastData: forecastResponse.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

weatherRouter.get('/api/cities', async (req, res) => {
  const { namePrefix } = req.query;

  try {
    const response = await axios.get(`${GEO_API_URL}/cities`, {
      params: {
        minPopulation: 10000,
        namePrefix,
      },
      headers: GEO_API_HEADERS,
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch city data' });
  }
});

weatherRouter.get('/api/fetch-weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    const response = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: API_KEY,
        q: city,
        days: 7,
        aqi: 'no',
        alerts: 'no',
      },
      timeout: 5000, 
    });

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error('Error request:', error.request);
      res.status(500).json({ error: 'No response from weather API' });
    } else {
      console.error('Error message:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = weatherRouter;
