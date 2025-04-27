import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../utils/api';

/**
 * Custom hook to fetch recent doubts
 * @param {number} limit - Number of recent doubts to fetch (defaults to 3)
 * @returns {Object} The recent doubts data, loading state, and error
 */
export function useRecentDoubts(limit = 3) {
  // Fetch the recent doubts data
  const fetchRecentDoubts = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await axios.get(`${API_URL}/api/doubts/recent?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Recent doubts data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent doubts:', error);
      throw error;
    }
  };

  // Use React Query to handle data fetching, caching, and state
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recentDoubts', limit],
    queryFn: fetchRecentDoubts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  return {
    doubtsData: data || [],
    isLoading,
    error,
    refetch
  };
} 