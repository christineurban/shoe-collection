-- First, ensure RLS is enabled on all tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoe_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dress_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON public.brands;
DROP POLICY IF EXISTS "Brands are insertable by authenticated users" ON public.brands;
DROP POLICY IF EXISTS "Brands are updatable by authenticated users" ON public.brands;

DROP POLICY IF EXISTS "Colors are viewable by everyone" ON public.colors;
DROP POLICY IF EXISTS "Colors are insertable by authenticated users" ON public.colors;
DROP POLICY IF EXISTS "Colors are updatable by authenticated users" ON public.colors;

DROP POLICY IF EXISTS "Locations are viewable by everyone" ON public.locations;
DROP POLICY IF EXISTS "Locations are insertable by authenticated users" ON public.locations;
DROP POLICY IF EXISTS "Locations are updatable by authenticated users" ON public.locations;

DROP POLICY IF EXISTS "Shoe types are viewable by everyone" ON public.shoe_types;
DROP POLICY IF EXISTS "Shoe types are insertable by authenticated users" ON public.shoe_types;
DROP POLICY IF EXISTS "Shoe types are updatable by authenticated users" ON public.shoe_types;

DROP POLICY IF EXISTS "Heel types are viewable by everyone" ON public.heel_types;
DROP POLICY IF EXISTS "Heel types are insertable by authenticated users" ON public.heel_types;
DROP POLICY IF EXISTS "Heel types are updatable by authenticated users" ON public.heel_types;

DROP POLICY IF EXISTS "Dress styles are viewable by everyone" ON public.dress_styles;
DROP POLICY IF EXISTS "Dress styles are insertable by authenticated users" ON public.dress_styles;
DROP POLICY IF EXISTS "Dress styles are updatable by authenticated users" ON public.dress_styles;

DROP POLICY IF EXISTS "Shoes are viewable by everyone" ON public.shoes;
DROP POLICY IF EXISTS "Shoes are insertable by authenticated users" ON public.shoes;
DROP POLICY IF EXISTS "Shoes are updatable by authenticated users" ON public.shoes;

-- Create policies for brands
CREATE POLICY "Brands are viewable by everyone" ON public.brands
  FOR SELECT USING (true);

CREATE POLICY "Brands are insertable by authenticated users" ON public.brands
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Brands are updatable by authenticated users" ON public.brands
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for colors
CREATE POLICY "Colors are viewable by everyone" ON public.colors
  FOR SELECT USING (true);

CREATE POLICY "Colors are insertable by authenticated users" ON public.colors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Colors are updatable by authenticated users" ON public.colors
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for locations
CREATE POLICY "Locations are viewable by everyone" ON public.locations
  FOR SELECT USING (true);

CREATE POLICY "Locations are insertable by authenticated users" ON public.locations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Locations are updatable by authenticated users" ON public.locations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for shoe_types
CREATE POLICY "Shoe types are viewable by everyone" ON public.shoe_types
  FOR SELECT USING (true);

CREATE POLICY "Shoe types are insertable by authenticated users" ON public.shoe_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Shoe types are updatable by authenticated users" ON public.shoe_types
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for heel_types
CREATE POLICY "Heel types are viewable by everyone" ON public.heel_types
  FOR SELECT USING (true);

CREATE POLICY "Heel types are insertable by authenticated users" ON public.heel_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Heel types are updatable by authenticated users" ON public.heel_types
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for dress_styles
CREATE POLICY "Dress styles are viewable by everyone" ON public.dress_styles
  FOR SELECT USING (true);

CREATE POLICY "Dress styles are insertable by authenticated users" ON public.dress_styles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Dress styles are updatable by authenticated users" ON public.dress_styles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for shoes
CREATE POLICY "Shoes are viewable by everyone" ON public.shoes
  FOR SELECT USING (true);

CREATE POLICY "Shoes are insertable by authenticated users" ON public.shoes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Shoes are updatable by authenticated users" ON public.shoes
  FOR UPDATE USING (auth.role() = 'authenticated');
