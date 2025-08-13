import axios from 'axios';
import { BASE_URL, API_ENDPOINTS, API_HEADERS } from './config';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: API_HEADERS,
});

// Add request interceptor to include auth token if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Or your token storage method
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => apiClient.post(API_ENDPOINTS.LOGIN, credentials),
    forgotPassword: (email) => apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email }),
    resetPassword: (data) => apiClient.post(API_ENDPOINTS.RESET_PASSWORD, data),
};

export const restaurantAPI = {
    getProfile: () => apiClient.get(API_ENDPOINTS.PROFILE),
    updateProfile: (data) => apiClient.post(API_ENDPOINTS.UPDATE_PROFILE, data),
    updateBasicInfo: (data) => apiClient.post(API_ENDPOINTS.UPDATE_BASIC_INFO, data),
};

export const orderAPI = {
    getAllOrders: (params) => apiClient.get(API_ENDPOINTS.ALL_ORDERS, { params }),
    getCurrentOrders: () => apiClient.get(API_ENDPOINTS.CURRENT_ORDERS),
    getOrderDetails: (orderId) => apiClient.get(`${API_ENDPOINTS.ORDER_DETAILS}?order_id=${orderId}`),
};

export const productAPI = {
    getProducts: () => apiClient.get(API_ENDPOINTS.PRODUCT_LIST),
    addProduct: (productData) => apiClient.post(API_ENDPOINTS.ADD_PRODUCT, productData),
    updateProduct: (productId, productData) => apiClient.post(`${API_ENDPOINTS.UPDATE_PRODUCT}/${productId}`, productData),
};

export const subscriptionAPI = {
    getBusinessPlans: () => apiClient.get(API_ENDPOINTS.BUSINESS_PLAN),
    getPackages: () => apiClient.get(API_ENDPOINTS.PACKAGES),
};

// Add more API modules as needed...