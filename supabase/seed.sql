-- Create a test student user in auth.users
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'authenticated', 
  'authenticated', 
  'student@demo.com', 
  crypt('password123', gen_salt('bf')), 
  now(), 
  now(), 
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create profile for the student
INSERT INTO public.profiles (id, full_name, email, role, university)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Priya Sharma (Demo)', 
  'student@demo.com', 
  'student', 
  'Demo University'
) ON CONFLICT (id) DO NOTHING;


-- Create a test psychologist user in auth.users
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222', 
  'authenticated', 
  'authenticated', 
  'dr.williams@demo.com', 
  crypt('password123', gen_salt('bf')), 
  now(), 
  now(), 
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create profile for the psychologist
INSERT INTO public.profiles (id, full_name, email, role, university)
VALUES (
  '22222222-2222-2222-2222-222222222222', 
  'Dr. Sarah Williams', 
  'dr.williams@demo.com', 
  'psychologist', 
  'Demo University'
) ON CONFLICT (id) DO NOTHING;


-- Assign the student to the psychologist
INSERT INTO public.assignments (student_id, psychologist_id)
VALUES ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (student_id, psychologist_id) DO NOTHING;


-- Insert some demo messages
INSERT INTO public.messages (sender_id, recipient_id, thread_id, content, created_at)
VALUES 
  (
    '22222222-2222-2222-2222-222222222222', -- From Dr. Williams
    '11111111-1111-1111-1111-111111111111', -- To Priya
    '33333333-3333-3333-3333-333333333333', 
    'Hi Priya, just checking in after our last session. How are you feeling about the breathing exercises we discussed?',
    NOW() - INTERVAL '2 days'
  ),
  (
    '11111111-1111-1111-1111-111111111111', -- From Priya
    '22222222-2222-2222-2222-222222222222', -- To Dr. Williams
    '33333333-3333-3333-3333-333333333333', 
    'I''ve been trying them before bed and they actually really help! I feel a bit more settled when I do them consistently.',
    NOW() - INTERVAL '1 day'
  );
