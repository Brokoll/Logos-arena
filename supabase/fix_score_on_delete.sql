-- Function to handle score updates on argument deletion
CREATE OR REPLACE FUNCTION public.handle_argument_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profile of the user who owned the deleted argument
  -- Each like is worth 5 points
  UPDATE public.profiles
  SET 
    argument_count = GREATEST(0, argument_count - 1),
    total_score = GREATEST(0, total_score - (OLD.like_count * 5))
  WHERE id = OLD.user_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after deletion
DROP TRIGGER IF EXISTS on_argument_delete ON public.arguments;

CREATE TRIGGER on_argument_delete
AFTER DELETE ON public.arguments
FOR EACH ROW
EXECUTE FUNCTION public.handle_argument_delete();
