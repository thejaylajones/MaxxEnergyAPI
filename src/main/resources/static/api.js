// Import API config
const API_BASE_URL = 'https://b5e776df14c2.ngrok-free.app';

// API Helper Function
async function apiCall(method, endpoint, data = null, requireAuth = false) {
    const headers = {
        'Content-Type': 'application/json'
    };

    // Get token from localStorage
    const authToken = localStorage.getItem('maxxenergy_token') || '';
    
    if (requireAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

// API Functions
async function healthCheck() {
    return await apiCall('GET', '/health');
}

async function registerUser(userData) {
    return await apiCall('POST', '/auth/register', userData);
}

async function loginUser(loginData) {
    return await apiCall('POST', '/auth/login', loginData);
}

async function changePassword(passwordData) {
    return await apiCall('POST', '/auth/change-password', passwordData, true);
}

async function resetPassword(resetData) {
    return await apiCall('POST', '/auth/reset-password', resetData);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        healthCheck,
        registerUser,
        loginUser,
        changePassword,
        resetPassword
    };
}
