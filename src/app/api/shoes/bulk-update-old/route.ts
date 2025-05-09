import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ShoeUpdate {
  id: string;
}

interface BrandUpdate {
  brand: string;
  shoe_ids: ShoeUpdate[] | null;
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
      updates.map(async ({ brand, shoe_ids }: BrandUpdate) => {
        try {
          // Find the brand
          const brandRecord = await prisma.brands.findUnique({
            where: { name: brand },
            select: { id: true }
          });

          if (!brandRecord) {
            return { brand, error: 'Brand not found' };
          }

          if (shoe_ids) {
            // Update individual shoes
            await Promise.all(
              shoe_ids.map(({ id }) =>
                prisma.shoes.update({
                  where: { id },
                  data: {
                    updated_at: new Date()
                  }
                })
              )
            );
          }

          return { brand, success: true };
        } catch (error) {
          console.error(`Error updating brand ${brand}:`, error);
          return { brand, error: 'Failed to update shoes' };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error updating shoes:', error);
    return NextResponse.json(
      { error: 'Failed to update shoes' },
      { status: 500 }
    );
  }
}
