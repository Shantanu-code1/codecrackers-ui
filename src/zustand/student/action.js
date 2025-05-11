import axios from "axios";
import { API_URL } from "../../utils/api";

export const getMonthlyStatus = async (email, year, month) => {
    try {
        const res = await axios.get(`${API_URL}/api/problem-of-the-day/monthly-status/${email}/${year}/${month}`);
        console.log('getMonthlyStatus', res);
        return res;
    } catch (error) {
        console.error('Error while getMonthlyStatus', error);
    }
};

/**
 * Submit a new doubt
 * @param {Object} doubtData - The doubt data to submit
 * @returns {Promise} - The API response
 */
export const submitDoubt = async (doubtData) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        const response = await axios.post(`${API_URL}/student/submit-question`, doubtData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Doubt submitted successfully:', response.data);
        return response;
    } catch (error) {
        console.error('Error submitting doubt:', error.response || error);
        throw error;
    }
};

/**
 * Fetch all doubts
 * @returns {Promise} - The API response containing the list of doubts
 */
export const getAllDoubts = async () => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        const response = await axios.get(`${API_URL}/api/doubts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Fetched all doubts successfully:', response.data);
        return response.data; // Return the data directly
    } catch (error) {
        console.error('Error fetching all doubts:', error);
        throw error;
    }
};