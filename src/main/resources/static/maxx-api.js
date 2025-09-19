
// MaxxEnergy API Integration
// This file connects the existing frontend to the backend API
// DO NOT MODIFY - This preserves all existing styling and functionality

const MAXX_API_BASE_URL = 'https://6b8717b54326.ngrok-free.app';

// API Helper Function
async function maxxApiCall(method, endpoint, data = null, requireAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    };

    // Get token from localStorage
    const authToken = localStorage.getItem('maxxenergy_token') || '';
    
    if (requireAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${MAXX_API_BASE_URL}${endpoint}`, {
            method: method,
            headers: headers,
            body: data ? JSON.stringify(data) : null
        });

        const responseData = await response.text();
        let parsedData;
        
        try {
            parsedData = JSON.parse(responseData);
        } catch {
            parsedData = responseData;
        }

        if (response.ok) {
            return { success: true, data: parsedData };
        } else {
            return { success: false, error: parsedData, status: response.status };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// API Functions for MaxxEnergy Frontend
window.maxxApi = {
    // Health Check
    async healthCheck() {
        return await maxxApiCall('GET', '/health');
    },

    // User Registration
    async registerUser(userData) {
        return await maxxApiCall('POST', '/auth/register', userData);
    },

    // User Login
    async loginUser(loginData) {
        const result = await maxxApiCall('POST', '/auth/login', loginData);
        if (result.success) {
            const token = result.data?.token || result.data;
            localStorage.setItem('maxxenergy_token', token);
        }
        return result;
    },

    // Change Password
    async changePassword(passwordData) {
        return await maxxApiCall('POST', '/auth/change-password', passwordData, true);
    },

    // Reset Password
    async resetPassword(resetData) {
        return await maxxApiCall('POST', '/auth/reset-password', resetData);
    },

    // Authentication Helpers
    setAuthToken(token) {
        if (token) {
            localStorage.setItem('maxxenergy_token', token);
        } else {
            localStorage.removeItem('maxxenergy_token');
        }
    },

    getAuthToken() {
        return localStorage.getItem('maxxenergy_token') || '';
    },

    isAuthenticated() {
        return !!this.getAuthToken();
    },

    logout() {
        localStorage.removeItem('maxxenergy_token');
        // Redirect to login or reload page
        window.location.reload();
    }
};
