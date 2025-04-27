import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '../zustand/login-signup/action'
import signuporloginStore from '../zustand/login-signup/store'
import { useCallback } from 'react'

export function useUserProfile() {
  // Use separate, simple selectors instead of a complex object selector
  const isAuthenticated = signuporloginStore(state => state.isAuthenticated)
  const userData = signuporloginStore(state => state.userData)
  
  // Get the setUserData function from the store
  const setUserData = useCallback((data) => {
    signuporloginStore.getState().setUserData(data)
  }, [])

  // Get the user's role from the store
  const userRole = userData?.role || 'ROLE_STUDENT'

  // Fetch the user profile using React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userProfile', userRole],
    queryFn: () => getUserProfile(userRole),
    enabled: isAuthenticated,
    onSuccess: (response) => {
      if (response && response.data) {
        const profileData = response.data.user || response.data.student || response.data.data || response.data
        
        // Update the store with the new data
        setUserData({
          ...profileData,
          role: userData?.role || profileData.role || userRole
        })
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    profileData: data?.data?.user || data?.data?.student || data?.data || userData,
    isLoading,
    error,
    refetch
  }
} 