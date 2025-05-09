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
      .from('nail-polish-images')
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
          details: 'The id field is required to identify the nail polish to update.'
        },
        { status: 400 }
      );
    }

    // Get current polish data to check for existing image
    const currentPolish = await prisma.nail_polish.findUnique({
      where: { id },
      include: { brands: true }
    });

    if (!currentPolish) {
      return NextResponse.json(
        {
          success: false,
          error: 'Polish not found',
          details: 'The specified nail polish id does not exist.'
        },
        { status: 404 }
      );
    }

    // If marking as no image available (imageUrl === 'n/a')
    if (imageUrl === 'n/a') {
      // If there was an existing image, delete it from storage
      if (currentPolish.image_url && currentPolish.image_url !== 'n/a') {
        await deleteImageFromSupabase(currentPolish.image_url);
      }

      // Update database to mark as no image available
      const updatedPolish = await prisma.nail_polish.update({
        where: { id },
        data: {
          image_url: 'n/a',
          updated_at: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        data: updatedPolish,
        message: 'Marked as no image available'
      });
    }

    // Regular image update flow
    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: imageUrl',
          details: 'The imageUrl field is required to update the nail polish image.'
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

    console.log('Uploading image to Supabase for polish:', {
      id: currentPolish.id,
      name: currentPolish.name,
      brand: currentPolish.brands.name,
      imageUrl: imageUrl.trim()
    });

    try {
      // Upload new image to Supabase storage
      const supabaseUrl = await uploadImageToSupabase(imageUrl.trim(), currentPolish);
      console.log('Supabase upload successful, URL:', supabaseUrl);

      // Only delete the old image if it exists and has a different filename
      if (currentPolish.image_url &&
          currentPolish.image_url !== 'n/a' &&
          currentPolish.image_url !== supabaseUrl) {
        const oldFileName = getFilenameFromUrl(currentPolish.image_url);
        const newFileName = getFilenameFromUrl(supabaseUrl);

        if (oldFileName && newFileName && oldFileName !== newFileName) {
          console.log('Deleting old image with different filename:', oldFileName);
          await deleteImageFromSupabase(currentPolish.image_url);
        }
      }

      // Update database with new Supabase URL
      const updatedPolish = await prisma.nail_polish.update({
        where: { id },
        data: {
          image_url: supabaseUrl,
          updated_at: new Date()
        }
      });

      console.log('Database updated with new URL:', JSON.stringify(updatedPolish, null, 2));

      return NextResponse.json({
        success: true,
        data: updatedPolish,
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
            details: 'The specified nail polish id does not exist.'
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
