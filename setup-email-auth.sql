-- OTP (One-Time Password) Email Authentication Setup
-- This SQL script is for reference only and doesn't need to be executed
-- Supabase automatically sets up the auth schema for email OTP authentication

-- =================================================================================
-- SUPABASE DASHBOARD CONFIGURATION REQUIRED:
-- =================================================================================

-- 1. MODIFY EMAIL TEMPLATE FOR OTP:
--    - Go to Authentication > Email Templates in Supabase dashboard
--    - Click on "Magic Link" template (this is used for OTP emails)
--    - Replace the content with OTP-focused template like:
--      <h2>Your Login Code</h2>
--      <p>Enter this code to sign in:</p>
--      <h1>{{ .Token }}</h1>
--      <p>This code will expire in 1 hour.</p>

-- 2. OPTIONAL - ADJUST OTP EXPIRY TIME:
--    - Go to Authentication > Providers > Email
--    - Find "Email OTP Expiration" setting
--    - Set to shorter duration (5-10 minutes recommended for security)
--    - Maximum allowed is 24 hours (86400 seconds)

-- 3. VERIFY EMAIL SETTINGS:
--    - Ensure your SMTP settings are configured for email delivery
--    - Test email delivery by trying the OTP flow
--    - Set up email rate limiting if necessary (default: 60 seconds between requests)

-- NOTE: Email OTP is ENABLED BY DEFAULT in Supabase
-- You don't need to enable any special "Email OTP" setting
-- The same signInWithOtp() method sends either magic links or OTP codes
-- depending on your email template content

-- =================================================================================
-- DATABASE SCHEMA SETUP:
-- =================================================================================

-- Create a trigger to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =================================================================================
-- TESTING NOTES:
-- =================================================================================
-- 1. OTP codes are 6 digits by default
-- 2. Default expiry is 1 hour (3600 seconds)
-- 3. Users can request new OTP once every 60 seconds
-- 4. Both sign-in and sign-up use the same OTP flow
-- 5. User profiles are automatically created on first successful OTP verification
-- 6. The email template determines whether users get magic links or OTP codes
