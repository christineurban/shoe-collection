import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PolishUpdate {
  id: string;
  is_old: boolean;
}

interface BrandUpdate {
  brand: string;
  is_old: boolean | null;
  polish_ids: PolishUpdate[] | null;
}

export async function POST(request: Request) {
  try {
    const { updates } = await request.json();

    // Validate request body
    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Process each brand update
    const results = await Promise.all(
      updates.map(async ({ brand, is_old, polish_ids }: BrandUpdate) => {
        try {
          // Find the brand
          const brandRecord = await prisma.brands.findUnique({
            where: { name: brand },
            select: { id: true }
          });

          if (!brandRecord) {
            return { brand, error: 'Brand not found' };
          }

          if (polish_ids) {
            // Update individual polishes
            await Promise.all(
              polish_ids.map(({ id, is_old }) =>
                prisma.nail_polish.update({
                  where: { id },
                  data: {
                    is_old,
                    updated_at: new Date()
                  }
                })
              )
            );
          } else if (is_old !== null) {
            // Update all polishes for this brand
            await prisma.nail_polish.updateMany({
              where: { brand_id: brandRecord.id },
              data: {
                is_old,
                updated_at: new Date()
              }
            });
          }

          return { brand, success: true };
        } catch (error) {
          console.error(`Error updating brand ${brand}:`, error);
          return { brand, error: 'Failed to update polishes' };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error updating polishes:', error);
    return NextResponse.json(
      { error: 'Failed to update polishes' },
      { status: 500 }
    );
  }
}
