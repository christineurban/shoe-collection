-- Drop the color_id column from shoes table
ALTER TABLE "shoes" DROP CONSTRAINT "shoes_color_id_fkey";
ALTER TABLE "shoes" DROP COLUMN "color_id";

-- Create the shoe_colors junction table
CREATE TABLE "shoe_colors" (
    "shoe_id" UUID NOT NULL,
    "color_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "shoe_colors_pkey" PRIMARY KEY ("shoe_id", "color_id")
);

-- Add foreign key constraints
ALTER TABLE "shoe_colors" ADD CONSTRAINT "shoe_colors_shoe_id_fkey" FOREIGN KEY ("shoe_id") REFERENCES "shoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shoe_colors" ADD CONSTRAINT "shoe_colors_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS on shoe_colors table
ALTER TABLE "shoe_colors" ENABLE ROW LEVEL SECURITY;

-- Create policies for shoe_colors
CREATE POLICY "Shoe colors are viewable by everyone" ON "shoe_colors"
    FOR SELECT USING (true);

CREATE POLICY "Shoe colors are insertable by authenticated users" ON "shoe_colors"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Shoe colors are updatable by authenticated users" ON "shoe_colors"
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Shoe colors are deletable by authenticated users" ON "shoe_colors"
    FOR DELETE USING (auth.role() = 'authenticated');
