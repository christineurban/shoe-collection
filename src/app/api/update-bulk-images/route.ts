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
      updates.map(async ({ polishId, imageUrl }) => {
        try {
          // Get polish details
          const polish = await prisma.nail_polish.findUnique({
            where: { id: polishId },
            include: { brands: true }
          });

          if (!polish) {
            return {
              id: polishId,
              success: false,
              error: 'Polish not found'
            };
          }

          let finalImageUrl: string;

          if (imageUrl === 'n/a') {
            finalImageUrl = 'n/a';
          } else {
            // Upload to Supabase and get URL
            finalImageUrl = await uploadImageToSupabase(imageUrl, polish);
          }

          // Update the database
          const updatedPolish = await prisma.nail_polish.update({
            where: { id: polishId },
            data: {
              image_url: finalImageUrl,
              updated_at: new Date()
            }
          });

          return {
            id: polishId,
            success: true,
            data: updatedPolish
          };
        } catch (error) {
          return {
            id: polishId,
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
