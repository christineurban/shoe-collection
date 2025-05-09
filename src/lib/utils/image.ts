import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.DATABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function createUrlSafeFilename(brand: string, name: string): string {
  const safeBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${safeBrand}-${safeName}`;
}

async function deleteOldImage(shoe: { brand: string, name: string }) {
  try {
    // Create a URL-safe filename
    const safeBrand = shoe.brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const safeName = shoe.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const fileName = `${safeBrand}-${safeName}`;

    // Delete the old image if it exists
    const { data: existingFiles, error: listError } = await supabase
      .storage
      .from('shoe-images')
      .list(fileName);

    if (listError) {
      console.error('Error listing existing files:', listError);
      return;
    }

    if (existingFiles && existingFiles.length > 0) {
      const { error: deleteError } = await supabase
        .storage
        .from('shoe-images')
        .remove([fileName]);

      if (deleteError) {
        console.error('Error deleting old image:', deleteError);
      }
    }
  } catch (error) {
    console.error('Error in deleteOldImage:', error);
  }
}

export async function uploadImageToSupabase(imageUrl: string, shoe: { brand: string, name: string }): Promise<string> {
  try {
    // Create metadata for the image
    const metadata = {
      brand: shoe.brand,
      name: shoe.name,
      uploadedAt: new Date().toISOString()
    };

    // Delete any existing image for this shoe
    await deleteOldImage(shoe);

    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    const imageBlob = await response.blob();

    // Create a URL-safe filename with brand and shoe name
    const fileName = createUrlSafeFilename(shoe.brand, shoe.name);

    // Upload the image to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('shoe-images')
      .upload(fileName, imageBlob, {
        contentType: imageBlob.type,
        upsert: true,
        cacheControl: '3600',
        metadata
      });

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('shoe-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
