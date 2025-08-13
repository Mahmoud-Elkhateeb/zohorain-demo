export const BASE_URL = 'https://test-api.pro-manager.net/zohorain-v1';

export const API_ENDPOINTS = {
    // Authentication
    CONFIG: '/api/v1/config',
    LOGIN: '/api/v1/auth/vendor/login',
    FORGOT_PASSWORD: '/api/v1/auth/vendor/forgot-password',
    VERIFY_TOKEN: '/api/v1/auth/vendor/verify-token',
    RESET_PASSWORD: '/api/v1/auth/vendor/reset-password',

    // Orders
    ALL_ORDERS: '/api/v1/vendor/all-orders',
    CURRENT_ORDERS: '/api/v1/vendor/current-orders',
    COMPLETED_ORDERS: '/api/v1/vendor/completed-orders',
    ORDER_DETAILS: '/api/v1/vendor/order-details',

    // Profile & Restaurant
    PROFILE: '/api/v1/vendor/profile',
    UPDATE_PROFILE: '/api/v1/vendor/update-profile',
    UPDATE_BASIC_INFO: '/api/v1/vendor/update-basic-info',
    UPDATE_BUSINESS_SETUP: '/api/v1/vendor/update-business-setup',

    // Products
    PRODUCT_LIST: '/api/v1/vendor/get-products-list',
    ADD_PRODUCT: '/api/v1/vendor/product/store',
    UPDATE_PRODUCT: '/api/v1/vendor/product/update',

    // Subscription
    BUSINESS_PLAN: '/api/v1/vendor/business_plan',
    PACKAGES: '/api/v1/vendor/package-view',

    // Add more endpoints as needed...
};

export const API_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add authorization header dynamically when user is logged in
};