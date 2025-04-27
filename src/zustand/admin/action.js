import axios from 'axios';
import { API_URL } from '../../utils/api';

// Function to add a new Problem of the Day
export const addProblemOfTheDay = async (problemData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  try {
    const response = await axios.post(`${API_URL}/api/problem-of-the-day`, problemData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Problem of the day added:', response);
    return response;
  } catch (error) {
    console.error('Error adding problem of the day:', error);
    throw error;
  }
};

// Function to get all problems of the day
export const getAllProblemsOfTheDay = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  try {
    const response = await axios.get(`${API_URL}/api/problem-of-the-day`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('All problems of the day:', response);
    return response;
  } catch (error) {
    console.error('Error fetching problems of the day:', error);
    throw error;
  }
};

// Function to get a problem of the day by date
export const getProblemOfTheDayByDate = async (date) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  try {
    const response = await axios.get(`${API_URL}/api/problem-of-the-day/${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Problem of the day for date:', response);
    return response;
  } catch (error) {
    console.error('Error fetching problem of the day by date:', error);
    throw error;
  }
};

// Function to delete a problem of the day by ID
export const deleteProblemOfTheDay = async (id) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  try {
    const response = await axios.delete(`${API_URL}/api/problem-of-the-day/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Problem of the day deleted:', response);
    return response;
  } catch (error) {
    console.error('Error deleting problem of the day:', error);
    throw error;
  }
};

/**
 * Mark POTD as solved for a specific user and date
 * @param {string} email - User's email
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<any>} - The API response
 */
export const markPotdAsSolved = async ({ email, date }) => {
  try {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token'); // Check for adminToken first
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Ensure date is in YYYY-MM-DD format (though the backend expects LocalDate)
    // The URL path variable should handle the conversion if formatted correctly.
    
    const response = await axios.post(`${API_URL}/api/problem-of-the-day/mark-solved/${email}/${date}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('POTD marked as solved successfully:', response.data);
    return response.data; // Should return true/boolean based on backend
  } catch (error) {
    console.error('Error marking POTD as solved:', error);
    // Rethrow to allow React Query to handle error state
    throw error.response?.data || error;
  }
}; 