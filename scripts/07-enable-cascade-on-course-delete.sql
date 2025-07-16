-- Make enrollments and lesson_progress cascade when the parent row is deleted
-- (safe to run multiple times thanks to IF EXISTS)

-- 1. Enrollments → Courses
ALTER TABLE enrollments
  DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey;

ALTER TABLE enrollments
  ADD CONSTRAINT enrollments_course_id_fkey
  FOREIGN KEY (course_id) REFERENCES courses(id)
  ON DELETE CASCADE;

-- 2. Lesson progress → Lessons
ALTER TABLE lesson_progress
  DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey;

ALTER TABLE lesson_progress
  ADD CONSTRAINT lesson_progress_lesson_id_fkey
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
  ON DELETE CASCADE;
