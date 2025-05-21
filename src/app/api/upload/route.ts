import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert the image to a buffer
    const buffer = await image.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${image.name}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('shoe-images')
      .upload(filename, fileBuffer, {
        contentType: image.type,
        upsert: false
      });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('shoe-images')
      .getPublicUrl(filename);

    return NextResponse.json({
      data: {
        image_url: publicUrl
      }
    });
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json(
      { error: 'Failed to process image upload' },
      { status: 500 }
    );
  }
}
