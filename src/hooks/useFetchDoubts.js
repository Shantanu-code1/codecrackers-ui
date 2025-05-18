import { useQuery } from '@tanstack/react-query';
import { getStudentDoubts } from '../zustand/student/action';
import { toast } from 'react-toastify';

/**
 * Custom hook to fetch doubts for the logged-in student
 * @returns {Object} Doubts data, loading state, error state, and refetch function
 */
export function useFetchDoubts() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studentDoubts'],
    queryFn: getStudentDoubts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch student doubts';
      toast.error(errorMessage);
    }
  });

  return {
    doubtsData: data || [],
    isLoading,
    isError: !!error,
    error,
    refetch
  };
} 