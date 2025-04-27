import { create } from 'zustand';

const useAdminStore = create((set) => ({
  problems: [],
  currentProblem: null,
  isLoading: false,
  error: null,
  
  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),
  
  // Set error state
  setError: (error) => set({ error }),
  
  // Set all problems
  setProblems: (problems) => set({ problems }),
  
  // Set current problem
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  
  // Add a new problem to the list
  addProblem: (problem) => set((state) => ({ 
    problems: [...state.problems, problem],
    currentProblem: problem 
  })),
  
  // Reset state
  resetState: () => set({ 
    problems: [],
    currentProblem: null,
    isLoading: false,
    error: null 
  })
}));

export default useAdminStore; 