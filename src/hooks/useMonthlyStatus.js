import { useQuery } from '@tanstack/react-query'
import signuporloginStore from '../zustand/login-signup/store'
import { getMonthlyStatus } from '../zustand/student/action'

export function useMonthlyStatus(month, year) {
  // Get authentication status from the store
  const isAuthenticated = signuporloginStore(state => state.isAuthenticated)
  
  // Get the user ID from the store
  const userData = signuporloginStore(state => state.userData)
  const userId = userData?.email
  
  console.log("useMonthlyStatus debug:", { userId, year, month, isAuthenticated })
  
  // Fetch the monthly status data using React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['monthlyStatus', userId, month, year],
    queryFn: () => {
      console.log("Calling API with:", { userId, year, month })
      return getMonthlyStatus(userId, year, month)
    },
    enabled: isAuthenticated && month !== undefined && year !== undefined && userId !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })

  // Process the data to create a map of dates to activity status
  // Where true means the day has learning activity (show green)
  // And false means no activity (show red)
  const monthlyStatusMap = {}
  
  if (data?.data) {
    console.log("Full API response:", data.data);
    
    // Handle the specific format {"year": 2025, "month": 3, "dailyStatus": {"1": false, "2": false, ...}}
    if (data.data.dailyStatus) {
      const { dailyStatus } = data.data;
      const responseYear = data.data.year || year;
      const responseMonth = data.data.month || month;
      
      // Convert day numbers to date strings: "1" -> "2025-03-01"
      Object.keys(dailyStatus).forEach(day => {
        const paddedMonth = String(responseMonth).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');
        const dateString = `${responseYear}-${paddedMonth}-${paddedDay}`;
        monthlyStatusMap[dateString] = dailyStatus[day];
      });
      
      console.log("Processed dailyStatus format:", monthlyStatusMap);
    } 
    // Fallback to other formats
    else {
      // Try different data paths to find the correct structure
      const statusData = data.data.data || data.data.status || data.data || {};
      console.log("Status data being processed:", statusData);
      
      // Check if statusData is an object or an array
      if (Array.isArray(statusData)) {
        // Handle array format
        statusData.forEach(item => {
          if (item.date && item.status !== undefined) {
            monthlyStatusMap[item.date] = item.status;
          }
        });
      } else {
        // Handle object format with date keys and boolean values
        Object.keys(statusData).forEach(date => {
          monthlyStatusMap[date] = statusData[date];
        });
      }
    }
    
    console.log("Final monthlyStatusMap:", monthlyStatusMap);
  } else if (error) {
    console.error("Error fetching monthly status:", error);
  }

  return {
    monthlyStatusMap,
    isLoading,
    error,
    refetch,
    userId
  }
} 