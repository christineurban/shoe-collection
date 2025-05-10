import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImageToSupabase } from '@/lib/utils/image';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      updates.map(async ({ shoeId, imageUrl }) => {
        try {
          // Get shoe details
          const shoe = await prisma.shoes.findUnique({
            where: { id: shoeId },
            include: {
              brand: true,
              heel_type: true,
              shoe_type: true
            }
          });

          if (!shoe) {
            return {
              id: shoeId,
              success: false,
              error: 'Shoe not found'
            };
          }

          let finalImageUrl = imageUrl;

          // If the image is a data URL, upload it to Supabase
          if (imageUrl.startsWith('data:')) {
            finalImageUrl = await uploadImageToSupabase(imageUrl, {
              brand: shoe.brand.name,
              heel_type: { name: shoe.heel_type.name },
              shoe_type: { name: shoe.shoe_type.name },
              id: shoe.id
            });
          }

          const updatedShoe = await prisma.shoes.update({
            where: { id: shoeId },
            data: {
              image_url: finalImageUrl
            }
          });

          return {
            id: shoeId,
            success: true,
            data: updatedShoe
          };
        } catch (error) {
          return {
            id: shoeId,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk update' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
