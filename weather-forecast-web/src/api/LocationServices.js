import axios from "axios";

const BASE_URL = process.env.REACT_APP_LOCATION_SERVICE_URL;

const LocationServices = {
  getAllLocations: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createLocation: async (userId, city) => {
    try {
      const response = await axios.post(`${BASE_URL}/create-location`, {
        userId,
        city,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default LocationServices;
