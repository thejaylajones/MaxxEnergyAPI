/* ================= MAXX ENERGY USER PROFILE SCRIPT ================= */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('User Profile Script Loaded');
    
    // Initialize the profile page
    initializeProfile();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load user data
    loadUserData();
});

/* ========= PROFILE IMAGE UPLOAD ========= */
function setupEventListeners() {
    // Profile image upload
    const fileInput = document.getElementById("fileInput");
    const profileImage = document.getElementById("profileImage");
    
    if (fileInput && profileImage) {
        fileInput.addEventListener("change", function(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(ev) {
                profileImage.src = ev.target.result;
                // Save the image data to localStorage for persistence
                localStorage.setItem('profileImage', ev.target.result);
                showNotification('Profile image updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Save personal information
    const savePersonalBtn = document.getElementById('savePersonalBtn');
    if (savePersonalBtn) {
        savePersonalBtn.addEventListener('click', savePersonalInfo);
    }
    
    // Update password
    const updatePasswordBtn = document.getElementById('updatePasswordBtn');
    if (updatePasswordBtn) {
        updatePasswordBtn.addEventListener('click', updatePassword);
    }
    
    // Logout functionality
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', logout);
    }
}

/* ========= INITIALIZE PROFILE ========= */
function initializeProfile() {
    // Load saved profile image
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        const profileImage = document.getElementById("profileImage");
        if (profileImage) {
            profileImage.src = savedImage;
        }
    }
    
    // Load saved user data
    loadUserData();
}

/* ========= LOAD USER DATA ========= */
function loadUserData() {
    // Try to get user data from localStorage first
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        updateUserDisplay(userData);
    } else {
        // Default user data
        const defaultUserData = {
            fullName: 'MAXX Energy User',
            email: 'user@maxxenergy.com',
            phone: '(555) 123-4567',
            role: 'Energy Professional'
        };
        updateUserDisplay(defaultUserData);
    }
}

/* ========= UPDATE USER DISPLAY ========= */
function updateUserDisplay(userData) {
    // Update profile header
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userRole = document.getElementById('userRole');
    
    if (userName) userName.textContent = userData.fullName;
    if (userEmail) userEmail.textContent = userData.email;
    if (userRole) userRole.textContent = userData.role;
    
    // Update form fields
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    if (fullNameInput) fullNameInput.value = userData.fullName;
    if (emailInput) emailInput.value = userData.email;
    if (phoneInput) phoneInput.value = userData.phone;
}

/* ========= SAVE PERSONAL INFORMATION ========= */
function savePersonalInfo() {
    console.log('Saving personal information...');
    
    // Get form data
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Validate input
    if (!fullName || !email) {
        showNotification('Please fill in all required fields (Name and Email)', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Create user data object
    const userData = {
        fullName: fullName,
        email: email,
        phone: phone,
        role: 'Energy Professional',
        lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update display
    updateUserDisplay(userData);
    
    // Show success message
    showNotification('Personal information saved successfully!', 'success');
    
    // Here you would typically send data to your backend API
    // For now, we'll just save locally
    console.log('User data saved:', userData);
}

/* ========= UPDATE PASSWORD ========= */
function updatePassword() {
    console.log('Updating password...');
    
    // Get password fields
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill in all password fields', 'error');
        return;
    }
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    // Check password strength
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }
    
    // Here you would typically send the password update to your backend API
    // For now, we'll just show a success message
    showNotification('Password updated successfully!', 'success');
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    console.log('Password update requested');
}

/* ========= LOGOUT FUNCTION ========= */
function logout() {
    console.log('Logging out...');
    
    // Clear localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('authToken');
    
    // Show logout message
    showNotification('Logged out successfully!', 'success');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = 'portal.html';
    }, 1500);
}

/* ========= NOTIFICATION SYSTEM ========= */
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

/* ========= PASSWORD STRENGTH INDICATOR ========= */
function checkPasswordStrength() {
    const passwordInput = document.getElementById('newPassword');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!passwordInput || !strengthIndicator) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        let strengthText = '';
        let strengthColor = '';
        
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        switch (strength) {
            case 0:
            case 1:
                strengthText = 'Very Weak';
                strengthColor = '#f44336';
                break;
            case 2:
                strengthText = 'Weak';
                strengthColor = '#ff9800';
                break;
            case 3:
                strengthText = 'Fair';
                strengthColor = '#ffc107';
                break;
            case 4:
                strengthText = 'Good';
                strengthColor = '#4caf50';
                break;
            case 5:
                strengthText = 'Strong';
                strengthColor = '#2196f3';
                break;
        }
        
        strengthIndicator.textContent = `Password Strength: ${strengthText}`;
        strengthIndicator.style.color = strengthColor;
    });
}

/* ========= INITIALIZE PASSWORD STRENGTH CHECKER ========= */
document.addEventListener('DOMContentLoaded', function() {
    checkPasswordStrength();
});

/* ========= ADD CSS ANIMATIONS ========= */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

