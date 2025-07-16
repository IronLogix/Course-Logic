-- This script shows how to set up the admin user
-- Note: You need to sign up through the UI first with email: ironlogic.contact@gmail.com
-- Then run this script to update the role to admin

-- First, you'll need to sign up through the website with:
-- Email: ironlogic.contact@gmail.com  
-- Password: 18kPlatinumGold@

-- After signing up, find your user ID and update the role
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from the auth.users table

-- Step 1: Check if the user exists in auth.users (this is read-only, just for reference)
-- SELECT id, email FROM auth.users WHERE email = 'ironlogic.contact@gmail.com';

-- Step 2: Insert or update the user profile with admin role
INSERT INTO users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Admin User'),
  'admin'
FROM auth.users au
WHERE au.email = 'ironlogic.contact@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  full_name = COALESCE(users.full_name, 'Admin User');

-- Verify the admin user was created
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE email = 'ironlogic.contact@gmail.com';
