-- MMJ Driving School - Supabase Migration Updates
-- Run this AFTER the initial migration to add missing features

-- ============================================
-- 0. Ensure has_role function exists
-- ============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = _role::public.app_role
  );
$$;

-- ============================================
-- 0.5. Ensure admin user has admin role
-- ============================================
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get user ID for righteouswebdev@gmail.com
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'righteouswebdev@gmail.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Insert admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  -- Get user ID for test@gmail.com
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'test@gmail.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Insert admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- ============================================
-- 1. Add approved column to gallery_items if not exists
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'gallery_items' AND column_name = 'approved'
  ) THEN
    ALTER TABLE public.gallery_items ADD COLUMN approved boolean DEFAULT false;
  END IF;
END $$;

-- ============================================
-- 2. Add approved column to reviews if not exists
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'approved'
  ) THEN
    ALTER TABLE public.reviews ADD COLUMN approved boolean DEFAULT false;
  END IF;
END $$;

-- ============================================
-- 3. Enable RLS (required for policies to apply)
-- ============================================
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3.5. Grant table-level permissions
-- ============================================
-- Ensure authenticated users can insert reviews
GRANT INSERT ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;

-- Ensure authenticated users can read their own roles
GRANT SELECT ON public.user_roles TO authenticated;

-- ============================================
-- 4. Drop existing policies to recreate them
-- ============================================
DROP POLICY IF EXISTS "public read approved gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "admins read all gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "admins manage gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "public read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins read all reviews" ON public.reviews;
DROP POLICY IF EXISTS "users insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins manage reviews" ON public.reviews;
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins read all roles" ON public.user_roles;

-- ============================================
-- 5. Create updated gallery policies
-- ============================================
CREATE POLICY "public read approved gallery"
ON public.gallery_items
FOR SELECT
USING (approved = true);

CREATE POLICY "admins read all gallery"
ON public.gallery_items
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "admins manage gallery"
ON public.gallery_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================
-- 6. Create updated reviews policies
-- ============================================
CREATE POLICY "public read approved reviews"
ON public.reviews
FOR SELECT
USING (approved = true);

CREATE POLICY "admins read all reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "users insert reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins manage reviews"
ON public.reviews
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================
-- 6. Create user_roles policies
-- ============================================
-- Authenticated users can read their own roles
CREATE POLICY "users read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can read all roles
CREATE POLICY "admins read all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(),'admin'));

-- ============================================
-- 7. Storage policies for MMJ Pictures bucket
-- ============================================
DROP POLICY IF EXISTS "public read MMJ pics" ON storage.objects;
DROP POLICY IF EXISTS "admins upload MMJ pics" ON storage.objects;
DROP POLICY IF EXISTS "admins delete MMJ pics" ON storage.objects;

CREATE POLICY "public read MMJ pics" ON storage.objects 
  FOR SELECT USING (bucket_id = 'MMJ Pictures');

CREATE POLICY "admins upload MMJ pics" ON storage.objects 
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id='MMJ Pictures' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "admins delete MMJ pics" ON storage.objects 
  FOR DELETE TO authenticated
  USING (bucket_id='MMJ Pictures' AND public.has_role(auth.uid(),'admin'));

-- ============================================
-- 8. Insert initial reviews (only if table is empty)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.reviews LIMIT 1) THEN
    INSERT INTO public.reviews (user_id, name, rating, text, approved) VALUES
      (null, 'Sherley', 5, 'I will to take this opportunity to thank MMJ driving school team more especially Jimmy and Jacob wow guys you done a very good job of teaching me how to driver i know it wasn''t easy but yes we did together one More time buti Jimmy you deserve Bells. Thank you so much may God bless you', true),
      (null, 'Nqobile', 5, 'I''d like to take this opportunity and thank MMJ driving School more specially to my instructor Mr Moloisi (Jimmy), you have been so patient with me from the beginning, very humble and with that I was able to learn fast, you even believed in me when I didn''t. Today I passed my driving licence code B even though people told me it was hard to pass it but you made it easy for me. Thank you very much. I will always recommend anyone to come have lessons with you because you''re the best teacher. Super proud. Thank you.', true),
      (null, 'Zamaswazi', 5, 'Jimmy is such a great instructor, patient and teaches you important details to ensure a great and east driving experience.', true),
      (null, 'Siyabonga', 5, 'The journey from fear to confidence in driving was made possible by MMJ''s exceptional patience and effective lessons. Obtaining my license today feels like a significant achievement, and I credit MMJ Driving School for teaching me so well that I succeeded in passing the test on my first attempt. For those hesitant about learning to drive, I enthusiastically recommend this driving school. The thought of starting can be daunting, but MMJ Driving School creates a supportive environment that fosters learning and boosts confidence. Their approach is truly commendable. Shout out to Jimmy and Jacob, Ngiyabonga kakhulu.', true),
      (null, 'ndivhuwo', 5, 'Great place to do your driving lessons, the driving lesson instructors are very patient and good at they''re job so i highly recommend for first timer. Thank you for the wonderful service', true),
      (null, 'Mbali', 5, 'Very patient and there''s no way you won''t learn, if mj could see how I drive now he''d be absolutely mortified', true),
      (null, 'Tracy', 5, 'Did my license (code 10) with MMJ driving school. Very professional and well mannered instructors. I highly recommend', true),
      (null, 'Kelebogile', 5, 'The instructor was very patient, they made learning how to park easy. He is good teacher, Highly recommend', true),
      (null, 'Zama', 5, 'Very awesome experience I had with MMJ. He is very patient and you can tell from His teachings that He know''s his story. The whole experience was enjoyable with him. I''m happy', true),
      (null, 'user', 5, 'Excellent teacher. Patient and very punctual. I miss his lesson every time when I''m driving.', true),
      (null, 'Ofentse', 5, 'I absolutely enjoyed driving with MJ. He is patient, attentive and very helpful. 5* service.', true),
      (null, 'Tracey', 5, 'Communication with clients is excellent, always keeps me up to date with events going on, great accommodating skills in terms of when I can be free, very patient', true),
      (null, 'Khethiwe', 5, 'MMJ always keep their clients updated and always professional. So far I''m grateful and happy', true),
      (null, 'Wanda', 5, 'Amazing experience, the instructor is very patient. They go out of their way to make sure you are ready for your test.', true),
      (null, 'Stephina', 5, 'Great service ever. They communicate with clients pretty well and pay attention to each and everyone. Very certisfying service', true),
      (null, 'Maharela', 5, 'I had a good experience with this driving school, they were very patient with me, taught me everything I needed to to know with driving, they very strict with time management alway make sure that you learn something before going home n I passed n got my driving licence on first attempt', true),
      (null, 'Tholakele', 5, 'Instructor is very patient and has taught me driving very well now I have my driving licence Code: C1', true);
  END IF;
END $$;
