import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Change this according to your server address and port

export const fetchConcerts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/concerts`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const saveConcert = async (concertData) => {
    try {
        const response = await axios.post(`${BASE_URL}/saveConcert`, concertData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteConcert = async (concertId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/concerts/${concertId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};