import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImageToSupabase } from '@/lib/utils/image';

const prisma = new PrismaClient();

function getFilenameFromUrl(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    return pathParts[pathParts.length - 1];
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}

async function deleteImageFromSupabase(imageUrl: string) {
  try {
    const fileName = getFilenameFromUrl(imageUrl);
    if (!fileName) {
      console.error('Could not parse filename from URL:', imageUrl);
      return;
    }

    console.log('Attempting to delete file:', fileName);

    // Delete the file from storage
    const { error } = await supabaseAdmin.storage
      .from('shoe-images')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting old image from storage:', error);
    } else {
      console.log('Successfully deleted file:', fileName);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

export async function POST(request: Request) {
  try {
    const { id, imageUrl } = await request.json();

    console.log('Received request to update image:', { id, imageUrl });

    // Enhanced input validation
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: id',
          details: 'The id field is required to identify the shoe to update.'
        },
        { status: 400 }
      );
    }

    // Get current shoe data to check for existing image
    const currentShoe = await prisma.shoes.findUnique({
      where: { id },
      include: {
        brand: true,
        heel_type: true,
        shoe_type: true
      }
    });

    if (!currentShoe) {
      return NextResponse.json({
        error: 'Shoe not found',
        details: 'The specified shoe id does not exist.'
      }, { status: 404 });
    }

    // Regular image update flow
    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: imageUrl',
          details: 'The imageUrl field is required to update the shoe image.'
        },
        { status: 400 }
      );
    }

    if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid imageUrl format',
          details: 'The imageUrl must be a non-empty string.'
        },
        { status: 400 }
      );
    }

    console.log('Uploading image to Supabase for shoe:', {
      id: currentShoe.id,
      name: currentShoe.brand.name,
      brand: currentShoe.brand.name,
    });

    try {
      // Upload new image to Supabase storage
      const supabaseUrl = await uploadImageToSupabase(imageUrl.trim(), {
        brand: currentShoe.brand.name,
        heel_type: { name: currentShoe.heel_type.name },
        shoe_type: { name: currentShoe.shoe_type.name },
        id: currentShoe.id
      });
      console.log('Supabase upload successful, URL:', supabaseUrl);

      // Delete old image if it exists and is different from new one
      if (currentShoe.image_url && currentShoe.image_url !== supabaseUrl) {
        const oldFileName = getFilenameFromUrl(currentShoe.image_url);
        if (oldFileName) {
          await deleteImageFromSupabase(currentShoe.image_url);
        }
      }

      // Update database with new Supabase URL
      const updatedShoe = await prisma.shoes.update({
        where: { id },
        data: {
          image_url: supabaseUrl,
          updated_at: new Date()
        },
        include: {
          brand: true
        }
      });

      console.log('Database updated with new URL:', JSON.stringify(updatedShoe, null, 2));

      return NextResponse.json({
        success: true,
        data: updatedShoe,
        message: 'Image updated successfully'
      });
    } catch (error) {
      console.error('Error during image upload:', error);
      throw error;
    }

  } catch (error) {
    console.error('Error updating image:', error);

    // Handle Prisma-specific errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            success: false,
            error: 'Record not found',
            details: 'The specified shoe id does not exist.'
          },
          { status: 404 }
        );
      }

      // Handle other database-related errors
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          details: 'An error occurred while updating the database.',
          code: error.code
        },
        { status: 500 }
      );
    }

    // Handle all other errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: errorMessage
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
