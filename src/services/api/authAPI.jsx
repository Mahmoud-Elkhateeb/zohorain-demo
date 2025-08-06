import { loginSuccess, loginFailure } from '../../features/authSlice';
import apiClient from '../apiClient';

export const login = async (credentials, dispatch) => {
  try {
    dispatch(loginStart());
    // Replace with your actual API endpoint
    const response = await apiClient.post('/auth/login', credentials);
    
    if (response.data) {
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.token
      }));
      return true;
    }
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    return false;
  }
};

export const logout = async (dispatch) => {
  try {
    await apiClient.post('/auth/logout');
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
};