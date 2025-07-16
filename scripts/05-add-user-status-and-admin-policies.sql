-- Add 'status' column to users table
ALTER TABLE users
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended'));

-- Update RLS policy for users table to allow admins to manage all users
-- Existing policy "Users can view their own profile" will still apply for non-admins
-- Existing policy "Users can update their own profile" will still apply for non-admins

-- Allow admins to view all user profiles
CREATE POLICY "Admins can view all user profiles" ON users FOR SELECT
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Allow admins to update any user profile (e.g., change status, role)
CREATE POLICY "Admins can update any user profile" ON users FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Allow admins to delete any user profile
CREATE POLICY "Admins can delete any user profile" ON users FOR DELETE
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Ensure the 'users' table has the correct RLS enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
