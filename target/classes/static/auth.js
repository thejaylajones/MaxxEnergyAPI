// Authentication Helper Functions
function setAuthToken(token) {
    if (token) {
        localStorage.setItem('maxxenergy_token', token);
    } else {
        localStorage.removeItem('maxxenergy_token');
    }
}

function getAuthToken() {
    return localStorage.getItem('maxxenergy_token') || '';
}

function isAuthenticated() {
    return !!getAuthToken();
}

// Authentication Handler Functions
async function handleLogin(loginData) {
    const result = await loginUser(loginData);
    
    if (result.success) {
        const token = result.data?.token || result.data;
        setAuthToken(token);
        return { success: true, token: token };
    } else {
        return { success: false, error: result.error };
    }
}

async function handleChangePassword(passwordData) {
    const result = await changePassword(passwordData);
    
    if (result.success) {
        return { success: true, message: 'Password changed successfully!' };
    } else {
        return { success: false, error: result.error };
    }
}

async function handleResetPassword(resetData) {
    const result = await resetPassword(resetData);
    
    if (result.success) {
        return { success: true, message: 'Password reset successfully!' };
    } else {
        return { success: false, error: result.error };
    }
}

function handleLogout() {
    setAuthToken('');
    // Redirect to login page or show login form
    window.location.reload();
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setAuthToken,
        getAuthToken,
        isAuthenticated,
        handleLogin,
        handleChangePassword,
        handleResetPassword,
        handleLogout
    };
}
