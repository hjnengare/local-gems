-- Required function for the interests API to work
-- Run this in your Supabase SQL editor

CREATE OR REPLACE FUNCTION replace_user_interests(p_user_id uuid, p_interest_ids text[])
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  -- Delete existing interests for this user
  DELETE FROM public.user_interests WHERE user_id = p_user_id;

  -- Insert new interests (if any)
  IF array_length(p_interest_ids, 1) > 0 THEN
    INSERT INTO public.user_interests (user_id, interest_id)
    SELECT p_user_id, unnest(p_interest_ids);
  END IF;
END;
$$;

-- Update the profiles table with interest count when interests change
CREATE OR REPLACE FUNCTION sync_profile_interest_meta()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.profiles
  SET interests_count = (
    SELECT count(*) FROM public.user_interests ui
    WHERE ui.user_id = coalesce(new.user_id, old.user_id)
  ),
  last_interests_updated = now(),
  updated_at = now()
  WHERE user_id = coalesce(new.user_id, old.user_id);

  RETURN null;
END;
$$;

-- Create trigger to automatically update profile metadata
DROP TRIGGER IF EXISTS user_interests_after_change ON public.user_interests;
CREATE TRIGGER user_interests_after_change
AFTER INSERT OR DELETE ON public.user_interests
FOR EACH ROW EXECUTE FUNCTION sync_profile_interest_meta();