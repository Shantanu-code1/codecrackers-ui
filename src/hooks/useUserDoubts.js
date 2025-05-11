import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../utils/api';
import signuporloginStore from '../zustand/login-signup/store';

/**
 * Custom hook to fetch doubts for the current logged-in user
 * @returns {Object} The user's doubts data, loading state, and error
 */
export function useUserDoubts() {
  // Get the user email from the auth store
  const userData = signuporloginStore(state => state.userData);
  const userEmail = userData?.email;
  const isAuthenticated = signuporloginStore(state => state.isAuthenticated);
  
  // Fetch the user's doubts
  const fetchUserDoubts = async () => {
    if (!userEmail) {
      throw new Error('User email not available');
    }
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await axios.get(`${API_URL}/api/doubts/user/email/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('User doubts data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user doubts:', error);
      throw error;
    }
  };

  // Use React Query to handle data fetching, caching, and state
  const { data, isLoading, error } = useQuery({
    queryKey: ['userDoubts', userEmail],
    queryFn: fetchUserDoubts,
    enabled: !!userEmail && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  return {
    userDoubtsData: data || [],
    isLoading,
    isError: !!error,
    error
  };
} 