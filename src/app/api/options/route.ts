import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [brands, colors, dressStyles, shoeTypes, heelTypes, locations] = await Promise.all([
      prisma.brands.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.colors.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.dress_styles.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.shoe_types.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.heel_types.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.locations.findMany({
        orderBy: { name: 'asc' }
      })
    ]);

    return NextResponse.json({
      brands: brands.map(b => b.name),
      colors: colors.map(c => c.name),
      dressStyles: dressStyles.map(d => d.name),
      shoeTypes: shoeTypes.map(s => s.name),
      heelTypes: heelTypes.map(h => h.name),
      locations: locations.map(l => l.name)
    });
  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    );
  }
}
