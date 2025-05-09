import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Polish } from '@/types/polish';
import type { Rating } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const data = await request.json() as Polish;

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

    // Start a transaction to create everything
    const newPolish = await prisma.$transaction(async (tx) => {
      // Create the polish record
      const polish = await tx.nail_polish.create({
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
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // Create color relationships
      for (const colorName of data.colors) {
        const color = await tx.colors.findUnique({
          where: { name: colorName }
        });

        if (color) {
          await tx.nail_polish_color.create({
            data: {
              nail_polish_id: polish.id,
              color_id: color.id,
              created_at: new Date(),
              updated_at: new Date()
            }
          });
        }
      }

      // Create finish relationships
      for (const finishName of data.finishes) {
        const finish = await tx.finishes.findUnique({
          where: { name: finishName }
        });

        if (finish) {
          await tx.nail_polish_finish.create({
            data: {
              nail_polish_id: polish.id,
              finish_id: finish.id,
              created_at: new Date(),
              updated_at: new Date()
            }
          });
        }
      }

      return polish;
    });

    return NextResponse.json(newPolish);
  } catch (error) {
    console.error('Error creating polish:', error);
    return NextResponse.json(
      { error: 'Failed to create polish' },
      { status: 500 }
    );
  }
}
