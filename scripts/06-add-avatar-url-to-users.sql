-- Add avatar_url column to the public.users table
ALTER TABLE public.users
ADD COLUMN avatar_url TEXT;

-- IMPORTANT:
-- Ensure your existing Row Level Security (RLS) policies for the 'users' table
-- allow authenticated users to UPDATE their own 'avatar_url'.
-- If you have a restrictive RLS policy, you might need to modify it.
-- For example, if you have a policy like:
-- CREATE POLICY "Enable users to update their own profile"
--   ON public.users FOR UPDATE
--   USING (auth.uid() = id)
--   WITH CHECK (auth.uid() = id);
-- This policy should generally cover new columns like 'avatar_url'.
-- If your policy explicitly lists allowed columns, you will need to add 'avatar_url' to that list.
