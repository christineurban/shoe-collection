import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { FileObject } from '@supabase/storage-js';
import { supabaseAdmin } from '@/lib/supabase';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get polish data using Prisma
    const polishData = await prisma.nail_polish.findMany({
      select: {
        id: true,
        image_url: true
      }
    });

    // Get storage files using admin client with a high limit
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('nail-polish-images')
      .list('', {
        limit: 10000, // Set a very high limit that's unlikely to be reached
        offset: 0
      });

    if (listError) {
      console.error('Error listing files:', listError);
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    if (!files || files.length === 0) {
      console.log('No files found in storage');
      const response = NextResponse.json({
        polishes: polishData,
        images: [],
        totalImages: 0,
        matchedImages: 0
      });

      // Add cache control headers
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');

      return response;
    }

    // Generate public URLs for all files and determine matches
    const allImageItems = files.map((file: FileObject) => {
      const { data } = supabaseAdmin.storage
        .from('nail-polish-images')
        .getPublicUrl(file.name);

      const url = data.publicUrl;

      // Check if this image URL exists in any polish's image_url field
      const matchingPolish = polishData.find(p => p.image_url === url);

      return {
        url,
        name: file.name,
        selectedPolishId: matchingPolish?.id,
        isMatched: !!matchingPolish
      };
    });

    const unmatchedImages = allImageItems.filter(item => !item.isMatched);

    const response = NextResponse.json({
      polishes: polishData,
      images: unmatchedImages,
      totalImages: files.length,
      matchedImages: allImageItems.filter(item => item.isMatched).length
    });

    // Add cache control headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
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
