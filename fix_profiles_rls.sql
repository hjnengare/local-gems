-- Fix missing INSERT policy for profiles table
-- This allows users to insert their own profile (needed for upsert operations)

CREATE POLICY "insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Also ensure we can read interests and subcategories catalogs
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read interests catalog" ON public.interests
  FOR SELECT
  USING (true);