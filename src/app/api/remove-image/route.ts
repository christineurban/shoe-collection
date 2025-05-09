import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Shoe ID is required' }, { status: 400 });
    }

    // First, get the current image URL
    const shoe = await prisma.shoes.findUnique({
      where: { id },
      include: {
        brand: true
      }
    });

    if (!shoe) {
      return NextResponse.json({ error: 'Shoe not found' }, { status: 404 });
    }

    // Delete the image from storage if it exists
    if (shoe.image_url) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('shoe-images')
        .remove([shoe.image_url.split('/').pop()!]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        return NextResponse.json({ error: 'Failed to delete image from storage' }, { status: 500 });
      }
    }

    // Update the database to remove the image URL
    await prisma.shoes.update({
      where: { id },
      data: {
        image_url: null,
        updated_at: new Date()
      }
    });

    return NextResponse.json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error('Error removing image:', error);
    return NextResponse.json({ error: 'Failed to remove image' }, { status: 500 });
  }
}
