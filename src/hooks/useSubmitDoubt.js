import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitDoubt } from '../zustand/student/action';
import { toast } from 'react-toastify';

/**
 * Custom hook to handle doubt submission
 * @returns {Object} Mutation functions and state
 */
export function useSubmitDoubt() {
  const queryClient = useQueryClient();
  
  const submitDoubtMutation = useMutation({
    mutationFn: submitDoubt,
    onSuccess: () => {
      toast.success('Your question has been submitted successfully');
      // Invalidate the allDoubts query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['allDoubts'] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit your question';
      toast.error(errorMessage);
    }
  });

  return {
    submitDoubt: submitDoubtMutation.mutate,
    isSubmitting: submitDoubtMutation.isPending,
    isSuccess: submitDoubtMutation.isSuccess,
    isError: submitDoubtMutation.isError,
    error: submitDoubtMutation.error
  };
} 