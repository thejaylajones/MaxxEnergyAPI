# Create Test User for Login

## Option 1: Use the Signup Form
1. Go to your website: `https://b5e776df14c2.ngrok-free.app/signup.html`
2. Fill out the signup form with:
   - **Name**: Test User
   - **Email**: test@maxxenergy.com
   - **Password**: password123
3. Click "Sign Up"
4. You should see "Registration successful!" message

## Option 2: Test Login
After creating the user above, go to:
1. `https://b5e776df14c2.ngrok-free.app/portal.html`
2. Enter:
   - **Username**: test@maxxenergy.com
   - **Password**: password123
3. Click "ENTER"

## Option 3: Direct Database Insert (if needed)
If the signup doesn't work, you can manually insert a user into the database:

```sql
INSERT INTO users (username, email, password, name, role, employee_id) 
VALUES ('test@maxxenergy.com', 'test@maxxenergy.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Test User', 'USER', 'EMP001');
```

The password above is "password123" encrypted with BCrypt.

## Current Status:
✅ Backend API endpoints fixed
✅ Login form connects to correct backend
✅ Registration form connects to correct backend
✅ Password reset form connects to correct backend
❌ Need to create a test user to verify login works

## Next Steps:
1. Create a test user using the signup form
2. Test login with the created user
3. Your login should now work properly!
