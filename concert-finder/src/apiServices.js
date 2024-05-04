import axios from 'axios';

// The base URL for your API
const BASE_URL = 'http://localhost:5050'; 

// Fetch all saved concerts
export const getSavedConcerts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/record/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Save a concert to the user's list
export const saveConcert = async (concertData) => {
    try {
        const response = await axios.post(`${BASE_URL}/record/`, concertData);
        console.log('success: ', concertData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Remove a concert from the user's saved list
export const removeConcert = async (concertId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/record/${concertId}`);
        console.log('Removed: ', concertId)
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getLocationForUser = async () =>{
    try {
        const USER = 1;
        const response = await axios.get(`${BASE_URL}/user/location/:${USER}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

// Log out the user
export const logoutUser = async () => {
    try {
        const response = await axios.delete(`${BASE_URL}/user/:1`);
        return response.data;
    } catch (error) {
        throw error;
    }
};