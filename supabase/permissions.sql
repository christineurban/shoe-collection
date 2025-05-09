-- Grant usage on the schema to all roles
GRANT USAGE ON SCHEMA public TO anon, postgres, service_role;

-- Grant select permissions on all tables to all roles
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, postgres, service_role;

-- Grant usage on sequences to all roles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, postgres, service_role;

-- Ensure RLS is enabled on all tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoe_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dress_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.brands;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.colors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.locations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.shoe_types;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.heel_types;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.dress_styles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.shoes;

-- Create policies for viewing data
CREATE POLICY "Enable read access for all users" ON public.brands
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.colors
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.locations
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.shoe_types
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.heel_types
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.dress_styles
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.shoes
  FOR SELECT USING (true);

-- Grant execute permission on all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, postgres, service_role;
