import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { FileObject } from '@supabase/storage-js';
import { supabaseAdmin } from '@/lib/supabase';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get shoe data using Prisma
    const shoeData = await prisma.shoes.findMany({
      include: {
        brand: true
      }
    });

    // Get all images from Supabase storage
    const { data: images, error } = await supabaseAdmin.storage
      .from('shoe-images')
      .list();

    if (error) {
      console.error('Error fetching images:', error);
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }

    // Map images to include metadata
    const imagesWithMetadata = images.map(image => {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shoe-images/${image.name}`;
      return {
        name: image.name,
        url,
        size: image.metadata.size,
        lastModified: image.metadata.lastModified,
        shoes: shoeData,
        selectedShoeId: null,
        isMatched: false
      };
    });

    // Check each image against shoe data
    const imagesWithMatches = imagesWithMetadata.map(image => {
      // Check if this image URL exists in any shoe's image_url field
      const matchingShoe = shoeData.find(s => s.image_url === image.url);

      return {
        ...image,
        selectedShoeId: matchingShoe?.id,
        isMatched: !!matchingShoe
      };
    });

    return NextResponse.json({
      images: imagesWithMatches,
      shoes: shoeData,
    });
  } catch (error) {
    console.error('Error in GET /api/images:', error);
    const response = NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );

    // Add cache control headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } finally {
    await prisma.$disconnect();
  }
}
