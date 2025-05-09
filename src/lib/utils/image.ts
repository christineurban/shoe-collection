import { supabaseAdmin } from '@/lib/supabase';
import sharp from 'sharp';

export function createUrlSafeFilename(brand: string, name: string): string {
  // Remove special characters and spaces, convert to lowercase
  const safeBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // Remove consecutive dashes and trim dashes from ends
  const cleanBrand = safeBrand.replace(/-+/g, '-').replace(/^-|-$/g, '');
  const cleanName = safeName.replace(/-+/g, '-').replace(/^-|-$/g, '');

  // Add timestamp to ensure uniqueness and prevent caching
  const timestamp = Date.now();

  const fileName = `${cleanBrand}_${cleanName}_${timestamp}.jpg`;
  console.log('Generated filename:', fileName);
  return fileName;
}

// Delete old image if it exists
async function deleteOldImage(polish: { brands: { name: string }, name: string }) {
  try {
    // Generate the old filename pattern (without timestamp)
    const safeBrand = polish.brands.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const safeName = polish.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cleanBrand = safeBrand.replace(/-+/g, '-').replace(/^-|-$/g, '');
    const cleanName = safeName.replace(/-+/g, '-').replace(/^-|-$/g, '');
    const filePattern = `${cleanBrand}_${cleanName}`;

    // List all files in the storage bucket
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('nail-polish-images')
      .list();

    if (listError) {
      console.error('Error listing files:', listError);
      return;
    }

    // Find and delete any files matching the pattern
    const matchingFiles = files?.filter(file => file.name.startsWith(filePattern));
    if (matchingFiles && matchingFiles.length > 0) {
      const { error: deleteError } = await supabaseAdmin.storage
        .from('nail-polish-images')
        .remove(matchingFiles.map(file => file.name));

      if (deleteError) {
        console.error('Error deleting old files:', deleteError);
      } else {
        console.log('Successfully deleted old files:', matchingFiles.map(f => f.name));
      }
    }
  } catch (error) {
    console.error('Error in deleteOldImage:', error);
  }
}

export async function uploadImageToSupabase(imageUrl: string, polish: { brands: { name: string }, name: string }): Promise<string> {
  console.log('Starting image upload process for:', {
    brand: polish.brands.name,
    name: polish.name,
    sourceUrl: imageUrl
  });

  try {
    // Delete old image files first
    await deleteOldImage(polish);

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    console.log('Successfully fetched image from source');

    const imageBuffer = await response.arrayBuffer();
    console.log('Image buffer size:', imageBuffer.byteLength);

    // Compress the image using sharp
    const compressedImageBuffer = await sharp(Buffer.from(imageBuffer))
      .resize(800, 800, { // Resize to max dimensions while maintaining aspect ratio
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ // Convert to JPEG and compress
        quality: 80,
        mozjpeg: true
      })
      .toBuffer();

    console.log('Successfully compressed image. New size:', compressedImageBuffer.length);

    // Create a URL-safe filename with brand and polish name
    const fileName = createUrlSafeFilename(polish.brands.name, polish.name);

    console.log('Uploading to Supabase with filename:', fileName);

    // Upload to Supabase storage with upsert to handle duplicates
    const { data, error } = await supabaseAdmin.storage
      .from('nail-polish-images')
      .upload(fileName, compressedImageBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload image to Supabase: ${error.message}`);
    }

    console.log('Supabase upload response:', data);

    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('nail-polish-images')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    throw error;
  }
}
