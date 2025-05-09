-- Enable Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoe_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE heel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE dress_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoes ENABLE ROW LEVEL SECURITY;

-- Create policies for brands
CREATE POLICY "Brands are viewable by everyone" ON brands
  FOR SELECT USING (true);

CREATE POLICY "Brands are insertable by authenticated users" ON brands
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Brands are updatable by authenticated users" ON brands
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for colors
CREATE POLICY "Colors are viewable by everyone" ON colors
  FOR SELECT USING (true);

CREATE POLICY "Colors are insertable by authenticated users" ON colors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Colors are updatable by authenticated users" ON colors
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for locations
CREATE POLICY "Locations are viewable by everyone" ON locations
  FOR SELECT USING (true);

CREATE POLICY "Locations are insertable by authenticated users" ON locations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Locations are updatable by authenticated users" ON locations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for shoe_types
CREATE POLICY "Shoe types are viewable by everyone" ON shoe_types
  FOR SELECT USING (true);

CREATE POLICY "Shoe types are insertable by authenticated users" ON shoe_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Shoe types are updatable by authenticated users" ON shoe_types
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for heel_types
CREATE POLICY "Heel types are viewable by everyone" ON heel_types
  FOR SELECT USING (true);

CREATE POLICY "Heel types are insertable by authenticated users" ON heel_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Heel types are updatable by authenticated users" ON heel_types
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for dress_styles
CREATE POLICY "Dress styles are viewable by everyone" ON dress_styles
  FOR SELECT USING (true);

CREATE POLICY "Dress styles are insertable by authenticated users" ON dress_styles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Dress styles are updatable by authenticated users" ON dress_styles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for shoes
CREATE POLICY "Shoes are viewable by everyone" ON shoes
  FOR SELECT USING (true);

CREATE POLICY "Shoes are insertable by authenticated users" ON shoes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Shoes are updatable by authenticated users" ON shoes
  FOR UPDATE USING (auth.role() = 'authenticated');
