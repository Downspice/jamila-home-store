-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Add policy to allow users to create their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (
    -- Allow if authenticated user matches the profile id OR if no user is authenticated (during signup)
    auth.uid() IS NULL OR auth.uid() = id
  );

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Add policy to allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  USING (auth.uid() = id); 