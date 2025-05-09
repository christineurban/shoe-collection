import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Polish } from '@/types/polish';
import type { Rating } from '@prisma/client';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const polish = await prisma.nail_polish.findUnique({
      where: { id: params.id },
      include: {
        brands: true,
        colors: {
          include: {
            color: true
          }
        },
        finishes: {
          include: {
            finish: true
          }
        }
      },
    });

    if (!polish) {
      return NextResponse.json(
        { error: 'Polish not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: polish.id,
      brand: polish.brands.name,
      name: polish.name,
      imageUrl: polish.image_url,
      colors: polish.colors.map(c => c.color.name),
      finishes: polish.finishes.map(f => f.finish.name),
      rating: polish.rating,
      link: polish.link,
      coats: polish.coats,
      notes: polish.notes,
      lastUsed: polish.last_used,
      totalBottles: polish.total_bottles,
      emptyBottles: polish.empty_bottles,
      isOld: polish.is_old
    });
  } catch (error) {
    console.error('Error fetching polish:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First, get the polish to check if it has an image
    const polish = await prisma.nail_polish.findUnique({
      where: { id: params.id }
    });

    if (!polish) {
      return NextResponse.json(
        { error: 'Polish not found' },
        { status: 404 }
      );
    }

    // Delete the image from storage if it exists
    if (polish.image_url) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('nail-polish-images')
        .remove([polish.image_url.split('/').pop()!]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
      }
    }

    // Delete all related records first
    await prisma.$transaction([
      prisma.nail_polish_color.deleteMany({
        where: { nail_polish_id: params.id }
      }),
      prisma.nail_polish_finish.deleteMany({
        where: { nail_polish_id: params.id }
      }),
      prisma.nail_polish.delete({
        where: { id: params.id }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting polish:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json() as Polish;
    const polishId = params.id;

    // Get the brand ID
    const brand = await prisma.brands.findUnique({
      where: { name: data.brand }
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Start a transaction to update everything
    const updatedPolish = await prisma.$transaction(async (tx) => {
      // Update the polish record
      const polish = await tx.nail_polish.update({
        where: { id: polishId },
        data: {
          name: data.name,
          brand_id: brand.id,
          rating: data.rating as Rating | null,
          link: data.link,
          coats: data.coats || undefined,
          notes: data.notes,
          last_used: data.lastUsed,
          total_bottles: data.totalBottles || undefined,
          empty_bottles: data.emptyBottles || undefined,
          is_old: data.isOld === null ? undefined : data.isOld,
          updated_at: new Date()
        }
      });

      // Delete existing color relationships
      await tx.nail_polish_color.deleteMany({
        where: { nail_polish_id: polishId }
      });

      // Create new color relationships
      for (const colorName of data.colors) {
        const color = await tx.colors.findUnique({
          where: { name: colorName }
        });

        if (color) {
          await tx.nail_polish_color.create({
            data: {
              nail_polish_id: polishId,
              color_id: color.id,
              updated_at: new Date()
            }
          });
        }
      }

      // Delete existing finish relationships
      await tx.nail_polish_finish.deleteMany({
        where: { nail_polish_id: polishId }
      });

      // Create new finish relationships
      for (const finishName of data.finishes) {
        const finish = await tx.finishes.findUnique({
          where: { name: finishName }
        });

        if (finish) {
          await tx.nail_polish_finish.create({
            data: {
              nail_polish_id: polishId,
              finish_id: finish.id,
              updated_at: new Date()
            }
          });
        }
      }

      return polish;
    });

    return NextResponse.json(updatedPolish);
  } catch (error) {
    console.error('Error updating polish:', error);
    return NextResponse.json(
      { error: 'Failed to update polish' },
      { status: 500 }
    );
  }
}
