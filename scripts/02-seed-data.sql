-- Remove fake statistics and update with realistic starting data
-- Insert sample courses (reduced to show it's a new platform)
INSERT INTO courses (title, description, thumbnail_url, price, is_free, is_published, category, duration_hours, level) VALUES
('Getting Started with Web Development', 'Learn the fundamentals of HTML, CSS, and JavaScript to build your first website from scratch.', '/placeholder.svg?height=200&width=300', 0, true, true, 'Web Development', 6, 'beginner'),
('Introduction to Python Programming', 'Master Python basics and start your programming journey with hands-on projects.', '/placeholder.svg?height=200&width=300', 49.99, false, true, 'Programming', 8, 'beginner');

-- Insert sample lessons for the first course only
INSERT INTO lessons (course_id, title, content, order_index, duration_minutes) 
SELECT 
  c.id,
  lesson_data.title,
  lesson_data.content,
  lesson_data.order_index,
  lesson_data.duration_minutes
FROM courses c
CROSS JOIN (
  VALUES 
    ('HTML Fundamentals', 'Learn the basic structure of HTML documents, essential tags, and how to create your first webpage. We will cover semantic HTML and best practices for writing clean, accessible code.', 1, 45),
    ('CSS Styling Basics', 'Introduction to CSS selectors, properties, and layout techniques. Learn how to style your HTML elements and create visually appealing web pages.', 2, 50),
    ('JavaScript Introduction', 'Get started with JavaScript variables, functions, and DOM manipulation. Build interactive elements for your websites.', 3, 60),
    ('Building Your First Project', 'Put everything together to create a complete website project. Apply HTML, CSS, and JavaScript skills in a real-world scenario.', 4, 75)
) AS lesson_data(title, content, order_index, duration_minutes)
WHERE c.title = 'Getting Started with Web Development';
