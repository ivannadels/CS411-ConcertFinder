import axios from 'axios';

// The base URL for your API
const BASE_URL = 'http://localhost:5000'; 

// Fetch all saved concerts
export const getSavedConcerts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/savedConcerts`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch concerts for a specific artist
export const getConcertsForArtist = async (artistName) => {
    try {
        const response = await axios.get(`${BASE_URL}/concerts/${artistName}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Save a concert to the user's list
export const saveConcert = async (concertData) => {
    try {
        const response = await axios.post(`${BASE_URL}/saveConcert`, concertData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Remove a concert from the user's saved list
export const removeConcert = async (concertId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/savedConcerts/${concertId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update user preferences
export const updateUserPreferences = async (userId, preferences) => {
    try {
        const response = await axios.patch(`${BASE_URL}/users/${userId}`, preferences);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// User login
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};
// Fetch concerts for a specific artist in a specific city
export const getConcertsForArtistCity = async (artistName, city) => {
    try {
        const response = await axios.get(`${BASE_URL}/concerts/${artistName}/${city}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Log out the user
export const logoutUser = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/logout`);
        return response.data;
    } catch (error) {
        throw error;
    }
};