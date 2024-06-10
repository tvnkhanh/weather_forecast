const WEATHER_SERVICE_URL = process.env.WEATHER_SERVICE_URL;

export async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(`${WEATHER_SERVICE_URL}/weather?lat=${lat}&lon=${lon}`);

    const data = await response.json();
    return [data.weatherData, data.forecastData];
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function fetchCities(input) {
  try {
    const response = await fetch(`${WEATHER_SERVICE_URL}/cities?namePrefix=${input}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}
