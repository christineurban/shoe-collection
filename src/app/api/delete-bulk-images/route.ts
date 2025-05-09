import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { images } = await request.json();

    // Validate request body
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    console.log('Attempting to delete images:', images);

    // Delete images from storage using admin client
    const { data, error } = await supabaseAdmin.storage
      .from('shoe-images')
      .remove(images);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    console.log('Supabase delete response:', data);

    // Add cache control headers to prevent browser caching
    const response = NextResponse.json({
      success: true,
      message: `Deleted ${images.length} images`,
      data
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error deleting images:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete images',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
