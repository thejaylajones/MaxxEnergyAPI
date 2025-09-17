# MaxxEnergy Frontend-Backend Integration Guide

## How to Connect Your Existing Frontend to the Backend

### Step 1: Add API Script to Your HTML Files

Add this script tag to the end of your HTML files (before closing `</body>` tag):

```html
<script src="maxx-api.js"></script>
```

### Step 2: Update Your Existing JavaScript Functions

#### For Login (in your existing login script):
Replace your existing login function with:

```javascript
async function yourExistingLoginFunction() {
    // Get your existing form data
    const username = document.getElementById('your-username-field').value;
    const password = document.getElementById('your-password-field').value;
    
    // Call the API
    const result = await maxxApi.loginUser({ username, password });
    
    if (result.success) {
        // Your existing success code here
        console.log('Login successful!');
        // Redirect to dashboard or show success message
    } else {
        // Your existing error handling here
        console.log('Login failed:', result.error);
        // Show error message to user
    }
}
```

#### For Registration (in your existing signup script):
Replace your existing register function with:

```javascript
async function yourExistingRegisterFunction() {
    // Get your existing form data
    const userData = {
        username: document.getElementById('your-username-field').value,
        email: document.getElementById('your-email-field').value,
        password: document.getElementById('your-password-field').value,
        name: document.getElementById('your-name-field').value,
        employeeId: document.getElementById('your-employee-id-field').value
    };
    
    // Call the API
    const result = await maxxApi.registerUser(userData);
    
    if (result.success) {
        // Your existing success code here
        console.log('Registration successful!');
    } else {
        // Your existing error handling here
        console.log('Registration failed:', result.error);
    }
}
```

#### For Change Password (if you have this feature):
```javascript
async function yourExistingChangePasswordFunction() {
    const passwordData = {
        oldPassword: document.getElementById('your-old-password-field').value,
        newPassword: document.getElementById('your-new-password-field').value
    };
    
    const result = await maxxApi.changePassword(passwordData);
    
    if (result.success) {
        // Your existing success code here
        console.log('Password changed successfully!');
    } else {
        // Your existing error handling here
        console.log('Password change failed:', result.error);
    }
}
```

### Step 3: Check Authentication Status

Add this to check if user is logged in:

```javascript
// Check if user is already logged in
if (maxxApi.isAuthenticated()) {
    // User is logged in - show dashboard or protected content
    console.log('User is authenticated');
} else {
    // User is not logged in - show login form
    console.log('User needs to login');
}
```

### Step 4: Logout Function

```javascript
function logout() {
    maxxApi.logout();
    // Your existing logout code here
}
```

## Important Notes:

1. **DO NOT** change your HTML structure or CSS
2. **DO NOT** modify your existing styling
3. **ONLY** add the `maxx-api.js` script tag
4. **ONLY** replace the function calls to use `maxxApi` instead of your existing API calls
5. Keep all your existing form field IDs and styling exactly the same

## Available API Functions:

- `maxxApi.healthCheck()` - Check if backend is running
- `maxxApi.registerUser(userData)` - Register new user
- `maxxApi.loginUser(loginData)` - Login user
- `maxxApi.changePassword(passwordData)` - Change password (requires login)
- `maxxApi.resetPassword(resetData)` - Reset password
- `maxxApi.isAuthenticated()` - Check if user is logged in
- `maxxApi.logout()` - Logout user

## Example Integration:

If your existing login function looks like this:
```javascript
function login() {
    // Your existing code
}
```

Change it to:
```javascript
async function login() {
    // Your existing form data collection
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Replace your existing API call with:
    const result = await maxxApi.loginUser({ username, password });
    
    // Keep your existing success/error handling
    if (result.success) {
        // Your existing success code
    } else {
        // Your existing error code
    }
}
```

This way, your frontend keeps its exact styling and functionality, but now connects to the backend API!
