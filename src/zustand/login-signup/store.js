import { create } from "zustand";
import { getUserProfile, signIn, signUp, verifyOtp } from "./action";
import axios from 'axios';

const signuporloginStore = create((set, get) => ({
    //initialization
    data: null,
    loading: false,
    error: null,
    userData: null,
    isAuthenticated: false,
    profileLoaded: false,

    // Get the current user data
    getUserData: () => get().userData,
    
    // Check if user is authenticated
    checkAuth: () => get().isAuthenticated,

    signInUser: async (userForm) => {
        set({ loading: true, error: null });
        try {
            const response = await signIn(userForm);
            console.log('signInUser response:', response);
            
            // If login successful, store JWT and set authentication
            if (response.data && response.data.status === true) {
                // Store JWT token
                localStorage.setItem('token', response.data.jwt);
                localStorage.setItem('loggedIn', true);
                
                // Basic user info
                const userRole = response.data.role;
                console.log("User role detected:", userRole); // Debug log
                
                // Create user data object
                const userData = {
                    email: userForm.email,
                    role: userRole,
                    
                    // Other fields will be filled when profile is loaded
                };
                
                // Store in Zustand state
                set({ 
                    userData: userData,
                    isAuthenticated: true
                });
                
                // Store in localStorage for persistence
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Redirect based on role - using window.location.replace for more reliable redirect
                console.log("Redirecting user based on role:", userRole);
                if (userRole === "ROLE_STUDENT") {
                    window.location.replace('/student/ai-tutor');
                } else if (userRole === "ROLE_TEACHER") {
                    window.location.replace('/teacher/profile');
                } else {
                    // Fallback - if role is undefined or unknown
                    console.warn("Unknown role, defaulting to student dashboard");
                    window.location.replace('/student/ai-tutor');
                }
            }
            
            set({ data: response, loading: false });
            return response;
        } catch (error) {
            console.error('signInUser Error:', error);
            set({ error: error?.message || "Login failed", loading: false });
            throw error;
        }
    },
    signUpUser: async (userForm) => {
        set({ loading: true, error: null });
        try {
            const response = await signUp(userForm);
            console.log('signUpUser', response);
            
            set({ data: response, loading: false });
            return response; // Return the response
        } catch (error) {
            console.error('signUpUser Error:', error);
            set({ error: error?.message, loading: false });
            throw error; // Rethrow the error to be handled in the calling function
        }
    },
    getUserProfile: async () => {
        const { userData, isAuthenticated } = get();
        
        // Skip if not authenticated
        if (!isAuthenticated) {
            console.error('Cannot fetch profile: User not authenticated');
            return null;
        }
        
        set({ loading: true, error: null });
        
        try {
            // Get user role from existing userData
            const userRole = userData?.role || 'ROLE_STUDENT';
            console.log(`Fetching profile for role: ${userRole}`);
            
            const response = await getUserProfile(userRole);
            
            if (response && response.data) {
                // Extract data carefully
                const responseData = response.data;
                const profileData = responseData.user || responseData.student || responseData.data || responseData;
                
                // Create a merged userData object that preserves the role
                const updatedUserData = {
                    ...profileData,
                    role: userData?.role || profileData.role || userRole
                };
                
                console.log("Updated user data:", updatedUserData);
                
                // Update state
                set({ 
                    userData: updatedUserData,
                    loading: false
                });
                
                // Store in localStorage
                // localStorage.setItem('userData', JSON.stringify(updatedUserData));
                
                return updatedUserData;
            }
            
            set({ loading: false });
            return userData;
        } catch (error) {
            console.error('getUserProfile Error:', error);
            set({ error: error?.message || "Failed to load profile", loading: false });
            return userData;
        }
    },
    verifyOtp: async (otpData) => {
        console.log('otpData', otpData);
        
        set({ loading: true, error: null });
        try {
            const response = await verifyOtp(otpData);
            console.log('verifyOtp response:', response);
            
            if (response.data && (response.data.status === true || response.data.status === "true")) {
                // Extract user data from response - check both student and user fields
                const userData = response.data.student || response.data.user || {};
                console.log("User data from response:", userData);
                
                // Filter out sensitive information before storing
                const safeUserData = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    role: userData.role, // Make sure this is capturing the role properly
                    profileImage: userData.profileImage,
                    verify: userData.verify,
                    shares: userData.shares,
                    points: userData.points,
                    availableForDoubts: userData.availableForDoubts,
                };
                
                console.log("Processed user data to store:", safeUserData);
                
                // Store in Zustand state
                set({ 
                    userData: safeUserData,
                    isAuthenticated: true
                });
                
                // Store in localStorage for persistence
                localStorage.setItem('userData', JSON.stringify(safeUserData));
            }
            
            set({ data: response, loading: false });
            return response;
        } catch (error) {
            console.error('verifyOtp Error:', error);
            set({ error: error?.message, loading: false });
            throw error;
        }
    },
    // Initialize user data from localStorage (call this when app loads)
    initializeUserData: () => {
        const storedUserData = localStorage.getItem('userData');
        const isLoggedIn = localStorage.getItem('loggedIn');
        
        if (storedUserData && isLoggedIn) {
            try {
                const userData = JSON.parse(storedUserData);
                set({ 
                    userData,
                    isAuthenticated: true
                });
            } catch (error) {
                console.error('Error parsing stored user data:', error);
            }
        }
    },
    // Logout function
    logout: () => {
        // Clear all data first, then redirect
        localStorage.removeItem('userData');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        
        set({ 
            userData: null, 
            isAuthenticated: false,
            data: null
        });
        
        // Force a complete page reload to ensure clean state
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
    },
    setUserData: (newUserData) => {
        set({ userData: newUserData })
        
        // Optionally save to localStorage
        // localStorage.setItem('userData', JSON.stringify(newUserData))
    }
}));

export default signuporloginStore;