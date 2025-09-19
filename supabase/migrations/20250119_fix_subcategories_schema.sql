-- migration: 2025-01-19_fix_subcategories_schema.sql

-- 1) Add interest_id column to subcategories table
ALTER TABLE public.subcategories
ADD COLUMN IF NOT EXISTS interest_id text NOT NULL DEFAULT '';

-- 2) Enable RLS and add public read policy
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subcategories public read" ON public.subcategories;
CREATE POLICY "subcategories public read"
  ON public.subcategories
  FOR SELECT
  USING (true);

-- 3) Create index for efficient filtering
CREATE INDEX IF NOT EXISTS subcategories_interest_id_idx
  ON public.subcategories(interest_id);

-- 4) Seed subcategories with proper interest_id values
INSERT INTO public.subcategories (id, label, interest_id) VALUES
  -- Food & Drink
  ('casual-eats', 'casual eats', 'food-drink'),
  ('sushi', 'sushi', 'food-drink'),
  ('cafes', 'cafés', 'food-drink'),
  ('fine-dining', 'fine dining', 'food-drink'),
  ('street-food', 'street food', 'food-drink'),
  ('vegan', 'vegan', 'food-drink'),

  -- Arts & Culture
  ('galleries', 'galleries', 'arts-culture'),
  ('theatre', 'theatre', 'arts-culture'),
  ('live-music', 'live music', 'arts-culture'),
  ('book-fair', 'book fair', 'arts-culture'),
  ('film-nights', 'film nights', 'arts-culture'),
  ('festivals', 'festivals', 'arts-culture')
ON CONFLICT (id) DO UPDATE
  SET label = EXCLUDED.label,
      interest_id = EXCLUDED.interest_id;

-- 5) Create RPC for atomic subcategory replacement (optional but recommended)
CREATE OR REPLACE FUNCTION public.replace_user_subcategories(
  p_user_id uuid,
  p_subcategory_ids text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete existing selections
  DELETE FROM public.user_subcategories
  WHERE user_id = p_user_id;

  -- Insert new selections if any
  IF array_length(p_subcategory_ids, 1) > 0 THEN
    INSERT INTO public.user_subcategories (user_id, subcategory_id)
    SELECT p_user_id, unnest(p_subcategory_ids);
  END IF;
END;
$$;

-- Grant execute permission
REVOKE ALL ON FUNCTION public.replace_user_subcategories(uuid, text[]) FROM public;
GRANT EXECUTE ON FUNCTION public.replace_user_subcategories(uuid, text[]) TO authenticated;