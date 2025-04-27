import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addProblemOfTheDay, getAllProblemsOfTheDay, getProblemOfTheDayByDate, deleteProblemOfTheDay } from '../zustand/admin/action';
import useAdminStore from '../zustand/admin/store';
import { toast } from 'react-toastify';
import axios from 'axios';
import { format } from 'date-fns';
import { API_URL } from '../utils/api';

export function useProblemsOfTheDay() {
  const queryClient = useQueryClient();
  const { setProblems, setLoading, setError } = useAdminStore();
  
  // Get all problems of the day
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['problemsOfTheDay'],
    queryFn: getAllProblemsOfTheDay,
    onSuccess: (response) => {
      if (response && response.data) {
        setProblems(response.data);
      }
    },
    onError: (error) => {
      setError(error.message || 'Failed to fetch problems of the day');
      toast.error('Failed to fetch problems of the day');
    }
  });
  
  // Add a new problem of the day
  const addProblemMutation = useMutation({
    mutationFn: addProblemOfTheDay,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      toast.success('Problem of the day added successfully!');
      queryClient.invalidateQueries(['problemsOfTheDay']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.message || 'Failed to add problem of the day');
      toast.error('Failed to add problem of the day');
      setLoading(false);
    }
  });
  
  // Delete a problem of the day
  const deleteProblemMutation = useMutation({
    mutationFn: deleteProblemOfTheDay,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      toast.success('Problem of the day deleted successfully!');
      queryClient.invalidateQueries(['problemsOfTheDay']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.message || 'Failed to delete problem of the day');
      toast.error('Failed to delete problem of the day');
      setLoading(false);
    }
  });
  
  // Function to fetch problem by date
  const getProblemByDate = (date) => {
    queryClient.fetchQuery({
      queryKey: ['problemOfTheDay', date],
      queryFn: () => getProblemOfTheDayByDate(date),
      onSuccess: (response) => {
        if (response && response.data) {
          useAdminStore.getState().setCurrentProblem(response.data);
        }
      },
      onError: (error) => {
        setError(error.message || 'Failed to fetch problem of the day');
        toast.error('Failed to fetch problem of the day');
      }
    });
  };
  
  return {
    problems: data?.data || [],
    isLoading,
    error,
    refetch,
    addProblem: addProblemMutation.mutate,
    isAddingProblem: addProblemMutation.isLoading,
    deleteProblem: deleteProblemMutation.mutate,
    isDeletingProblem: deleteProblemMutation.isLoading,
    getProblemByDate
  };
}

/**
 * Custom hook to fetch the Problem of the Day data for a specific date
 * @param {Date} date - The date to fetch the problem for (defaults to today)
 * @returns {Object} The problem data, loading state, and error
 */
export function useProblemOfTheDay(date = new Date()) {
  // Format the date as ISO format (YYYY-MM-DD) for the API
  const formattedDate = format(date, 'yyyy-MM-dd');

  // Fetch the problem of the day data
  const fetchProblemOfTheDay = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await axios.get(`${API_URL}/api/problem-of-the-day/${formattedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Problem of the day data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching problem of the day:', error);
      throw error;
    }
  };

  // Use React Query to handle data fetching, caching, and state
  const { data, isLoading, error } = useQuery({
    queryKey: ['problemOfTheDay', formattedDate],
    queryFn: fetchProblemOfTheDay,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });

  return {
    problemData: data,
    isLoading,
    error,
    date: formattedDate
  };
} 