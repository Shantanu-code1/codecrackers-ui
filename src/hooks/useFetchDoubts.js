import { useQuery } from '@tanstack/react-query';
import { getAllDoubts } from '../zustand/student/action';
import { toast } from 'react-toastify';

/**
 * Custom hook to fetch all doubts
 * @returns {Object} Doubts data, loading state, error state, and refetch function
 */
export function useFetchDoubts() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['allDoubts'],
    queryFn: getAllDoubts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch doubts';
      toast.error(errorMessage);
    }
  });

  return {
    doubtsData: data || [], // Return an empty array if data is undefined
    isLoading,
    isError: !!error,
    error,
    refetch
  };
} 