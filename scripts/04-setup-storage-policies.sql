-- Create a new storage bucket for course media if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-media', 'course-media', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policy for authenticated users to upload to a 'temp_uploads' folder (e.g., for rich text editor)
-- This allows any authenticated user to upload files to their specific temporary folder.
CREATE POLICY "Allow authenticated users to upload to temp_uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'course-media' AND path LIKE 'temp_uploads/' || auth.uid() || '/%');

-- Policy for authenticated users to view files in 'temp_uploads' (their own)
-- This ensures users can see the files they've uploaded temporarily.
CREATE POLICY "Allow authenticated users to view their temp_uploads"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'course-media' AND path LIKE 'temp_uploads/' || auth.uid() || '/%');

-- Policy for admins to move files (e.g., from temp to permanent course paths)
-- This is crucial for the saveCourse function to move files after course creation.
CREATE POLICY "Allow admins to move files in course-media bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'course-media' AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (bucket_id = 'course-media' AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to delete files in course-media bucket
-- Allows admins to clean up or manage media files.
CREATE POLICY "Allow admins to delete files in course-media bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'course-media' AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Policy for anyone to view published course media (read-only for public)
-- This allows public access to media once it's associated with a published course.
CREATE POLICY "Allow public read access to published course media"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-media' AND path LIKE 'courses/%' AND EXISTS (
  SELECT 1 FROM public.courses c
  WHERE c.is_published = TRUE AND path LIKE 'courses/' || c.id || '/%'
));
