import { supabaseAdmin } from '@/lib/supabase';

function createUrlSafeFilename(brand: string, heelType: string, shoeType: string, id: string): string {
  const safeBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeHeelType = heelType.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeShoeType = shoeType.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${safeBrand}-${safeHeelType}-${safeShoeType}-${id}`;
}

async function deleteOldImage(shoe: { brand: string, heel_type: { name: string }, shoe_type: { name: string }, id: string }) {
  try {
    // Create a URL-safe filename
    const fileName = createUrlSafeFilename(shoe.brand, shoe.heel_type.name, shoe.shoe_type.name, shoe.id);

    // Delete the old image if it exists
    const { data: existingFiles, error: listError } = await supabaseAdmin
      .storage
      .from('shoe-images')
      .list(fileName);

    if (listError) {
      console.error('Error listing existing files:', listError);
      return;
    }

    if (existingFiles && existingFiles.length > 0) {
      const { error: deleteError } = await supabaseAdmin
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

export async function uploadImageToSupabase(imageUrl: string, shoe: { brand: string, heel_type: { name: string }, shoe_type: { name: string }, id: string }): Promise<string> {
  try {
    // Create metadata for the image
    const metadata = {
      brand: shoe.brand,
      heelType: shoe.heel_type.name,
      shoeType: shoe.shoe_type.name,
      id: shoe.id,
      uploadedAt: new Date().toISOString()
    };

    // Delete any existing image for this shoe
    await deleteOldImage(shoe);

    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    const imageBlob = await response.blob();

    // Create a URL-safe filename with brand, heel type, shoe type, and ID
    const fileName = createUrlSafeFilename(shoe.brand, shoe.heel_type.name, shoe.shoe_type.name, shoe.id);

    // Upload the image to Supabase Storage
    const { error } = await supabaseAdmin
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
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('shoe-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
