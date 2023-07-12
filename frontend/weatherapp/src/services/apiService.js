import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/v1";

const apiService = axios.create({
  baseURL: API_BASE_URL,
});

// Weather widget Api Service

export const getCoords = async () => {
    try {
        console.log('Getting coordinates')
        return await axios.get('http://ip-api.com/json')
    } catch (error) {
        console.log(error);
        throw new Error('Error getting location information');
    }
};

export const getWeather = async (lat, lon) => {
    try {
        return await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&current_weather=true`)
    } catch (error) {
        console.error(error)
        throw new Error('Error getting weather information');
    }
}