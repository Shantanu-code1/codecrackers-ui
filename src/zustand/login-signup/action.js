import axios from 'axios';
import { API_URL } from '../../utils/api';

export const signUp = async (userFormData) => {
    try {
        const res = await axios.post(`${API_URL}/code/signup`, userFormData);
        console.log('signUp', res);
        return res;
    } catch (error) {
        console.error('Error while signUp', error);
    }
};

export const signIn = async (userFormData) => {
    try {
        const res = await axios.post(`${API_URL}/code/signin`, userFormData);
        console.log('signIn', res);
        return res;
    } catch (error) {
        console.error('Error while sign in', error);
    }
};

export const getUserProfile = async (userRole) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    // Determine endpoint based on role
    const endpoint = userRole === 'ROLE_TEACHER' 
        ? `${API_URL}/teacher/profile` 
        : `${API_URL}/student/profile`;
    
    try {
        const res = await axios.get(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('getUserProfile response:', res);
        if(res.status === 200) {
            localStorage.setItem('userData', JSON.stringify(res.data));
            return res.data;
        } else {
            throw new Error('Failed to fetch user profile');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const verifyOtp = async (object) => {
    try {
        const res = await axios.post(`${API_URL}/code/verify?email=${object?.email}&otp=${object?.otpString}`);
        console.log('getUserProfile', res);
        return res;
    } catch (error) {
        console.error('Error while signUp', error);
    }
};
