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
 * Fetch all doubts (intended for admin/teacher roles)
 * @returns {Promise} - The API response containing the list of doubts
 */
export const getAllDoubtsForAdminsOrTeachers = async () => {
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

/**
 * Fetch all doubts for the currently logged-in student using their email.
 * @returns {Promise} - The API response containing the list of the student's doubts.
 */
export const getStudentDoubts = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            throw new Error('No user data found in localStorage');
        }
        const userData = JSON.parse(userDataStr);
        const userEmail = userData.email;

        if (!userEmail) {
            throw new Error('No email found in user data for fetching student doubts');
        }

        const response = await axios.get(`${API_URL}/api/doubts/user/email/${userEmail}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Fetched student doubts successfully:', response.data);
        return response.data; // Return the data directly
    } catch (error) {
        console.error('Error fetching student doubts:', error.response?.data || error.message || error);
        throw error;
    }
};

/**
 * Fetch a list of recent doubts.
 * @param {number} [limit=3] - The maximum number of recent doubts to fetch.
 * @returns {Promise} - The API response containing a list of RecentDoubtDTO objects.
 */
export const getRecentDoubts = async (limit = 3) => {
    try {
        const token = localStorage.getItem('token'); // Assuming this might need auth too
        if (!token) {
            throw new Error('No authentication token found');
        }
        const response = await axios.get(`${API_URL}/api/doubts/recent`, {
            params: { limit },
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        console.log('Fetched recent doubts:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent doubts:', error.response?.data || error.message || error);
        throw error;
    }
};

/**
 * Fetch a list of recent doubts filtered by category.
 * @param {string} category - The category to filter by.
 * @param {number} [limit=3] - The maximum number of doubts to fetch.
 * @returns {Promise} - The API response containing a list of RecentDoubtDTO objects.
 */
export const getDoubtsByCategory = async (category, limit = 3) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        if (!category) {
            throw new Error('Category is required for fetching doubts by category');
        }
        const response = await axios.get(`${API_URL}/api/doubts/category/${category}`, {
            params: { limit },
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        console.log(`Fetched doubts for category ${category}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching doubts for category ${category}:`, error.response?.data || error.message || error);
        throw error;
    }
};

/**
 * Fetch a list of recent doubts filtered by type (e.g., doubts, queries, ai).
 * @param {string} filterType - The filter to apply (maps to "filter" path variable).
 * @param {number} [limit=3] - The maximum number of doubts to fetch.
 * @returns {Promise} - The API response containing a list of RecentDoubtDTO objects.
 */
export const getDoubtsByFilterType = async (filterType, limit = 3) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        if (!filterType) {
            throw new Error('Filter type is required for fetching filtered doubts');
        }
        const response = await axios.get(`${API_URL}/api/doubts/filter/${filterType}`, {
            params: { limit },
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`Fetched doubts by filter ${filterType}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching doubts by filter ${filterType}:`, error.response?.data || error.message || error);
        throw error;
    }
};

/**
 * Submit a new query or doubt to the specified API endpoint
 * @param {Object} queryData - The query data to submit
 * @returns {Promise} - The API response
 */
export const submitQuery = async (queryData) => {
    try {
        // Get user data from localStorage
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            throw new Error('No user data found in localStorage');
        }
        console.log('userDataStr', userDataStr);
        const userData = JSON.parse(userDataStr);
        const studentId = userData.studentId;
        
        if (!studentId) {
            throw new Error('No student ID found in user data');
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        // Process tags - ensure it's a properly formatted array
        let tagsArray = [];
        if (queryData.tags) {
            if (Array.isArray(queryData.tags)) {
                tagsArray = queryData.tags;
            } else if (typeof queryData.tags === 'string') {
                // If tags is a comma-separated string, split it
                tagsArray = queryData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }
        
        // Add a field to specify this is a query, not a doubt
        const payload = {
            ...queryData,
            tags: tagsArray, // Ensure tags is properly formatted
            type: 'query', // Explicitly mark this as a query
            isDoubt: false // Ensure it's not marked as a doubt
        };
        
        console.log("Submitting query with payload:", payload);
        
        const response = await axios.post(`${API_URL}/api/queries/student/${studentId}`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Query submitted successfully:', response.data);
        return response;
    } catch (error) {
        console.error('Error submitting query:', error.response?.data || error.message || error);
        throw error;
    }
};

/**
 * Fetch all queries for the student
 * @returns {Promise} - The API response containing the list of queries
 */
export const getQueries = async () => {
    try {
        // Get user data from localStorage
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            throw new Error('No user data found in localStorage');
        }
        
        const userData = JSON.parse(userDataStr);
        const studentId = userData.studentId;
        
        if (!studentId) {
            throw new Error('No student ID found in user data');
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        // Specifically request queries only (not doubts)
        const response = await axios.get(`${API_URL}/api/queries`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                type: 'query', // Specify that we only want queries, not doubts
                studentId: studentId // Pass studentId as a parameter if needed
            }
        });
        
        console.log('Fetched queries successfully:', response.data);
        return response.data; // Return the full response data including success flag and metadata
    } catch (error) {
        console.error('Error fetching queries:', error.response?.data || error.message || error);
        throw error;
    }
};

/**
 * Get answers for a specific query
 * @param {number} queryId - The ID of the query to get answers for
 * @returns {Promise} - The API response containing the answers
 */
export const getQueryAnswers = async (queryId) => {
    try {
        if (!queryId) {
            throw new Error('Query ID is required');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        const response = await axios.get(`${API_URL}/api/answers/query/${queryId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`Fetched answers for query ${queryId} successfully:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching answers for query ${queryId}:`, error.response?.data || error.message || error);
        throw error;
    }
};

/**
 * Submit an answer to a query
 * @param {number} queryId - The ID of the query being answered
 * @param {Object} answerData - The answer data to submit
 * @returns {Promise} - The API response
 */
export const submitAnswer = async (queryId, answerData) => {
    try {
        if (!queryId) {
            throw new Error('Query ID is required');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        // Get user data from localStorage
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            throw new Error('No user data found in localStorage');
        }
        
        const userData = JSON.parse(userDataStr);
        let studentId = userData.studentId;
        const payload = {
            ...answerData,
            studentId: studentId // Include the student ID who is answering
        };
        
        const response = await axios.post(`${API_URL}/api/answers/doubt/${queryId}/student/${studentId}`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`Answer submitted for query ${queryId} successfully:`, response.data);
        return response;
    } catch (error) {
        console.error(`Error submitting answer for query ${queryId}:`, error.response?.data || error.message || error);
        throw error;
    }
};