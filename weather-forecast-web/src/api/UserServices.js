import axios from 'axios';

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL;
// const USER_SERVICE_URL = 'http://192.168.1.40:5000';

const UserServices = {

  signup: async (name, email, password) => {
    try {
      const response = await axios.post(`${USER_SERVICE_URL}/api/signup`, {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error.response.data;
    }
  },

  signin: async (email, password) => {
    try {
      const response = await axios.post(`${USER_SERVICE_URL}/api/signin`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error during signin:', error);
      throw error.response.data;
    }
  },

  tokenIsValid: async (token) => {
    try {
      const response = await axios.post(
        `${USER_SERVICE_URL}/tokenIsValid`,
        {},
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error during token validation:', error);
      throw error.response.data;
    }
  },

  getCurrentUser: async (token) => {
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/`, {
        headers: {
          'x-auth-token': token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error.response.data;
    }
  },
};

export default UserServices;
