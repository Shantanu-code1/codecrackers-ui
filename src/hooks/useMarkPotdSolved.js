import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markPotdAsSolved } from '../zustand/admin/action';
import { toast } from 'react-toastify';

/**
 * Custom hook to handle marking POTD as solved
 * @returns {Object} Mutation function and state
 */
export function useMarkPotdSolved() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: markPotdAsSolved, // Pass the action function
    onSuccess: (data, variables) => {
      toast.success(`POTD for ${variables.email} on ${variables.date} marked as solved!`);
      // Optionally invalidate related queries if needed, e.g., user progress queries
      // queryClient.invalidateQueries(...);
    },
    onError: (error, variables) => {
      const errorMessage = error?.message || 'Failed to mark POTD as solved';
      toast.error(`Error for ${variables.email} on ${variables.date}: ${errorMessage}`);
    },
  });

  return {
    markSolved: mutation.mutate,
    isMarking: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
} 