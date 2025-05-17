import axios from "axios";
import { API_URL } from "../../utils/api";

/**
 * Initiate an answer session for a specific doubt.
 * @param {number} doubtId - The ID of the doubt to initiate the session for.
 * @returns {Promise} - The API response.
 */
export const initiateAnswerSession = async (doubtId) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        if (!doubtId) {
            throw new Error('Doubt ID is required to initiate an answer session');
        }
        
        // Assuming a POST request. If it's GET or needs a body, adjust accordingly.
        const response = await axios.post(`${API_URL}/api/doubts/${doubtId}/initiate-answer-session`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Answer session initiated successfully for doubt ID:', doubtId, response.data);
        return response.data; // Return the data from the response
    } catch (error) {
        console.error('Error initiating answer session for doubt ID:', doubtId, error.response || error);
        throw error; // Re-throw the error to be caught by the caller
    }
}; 