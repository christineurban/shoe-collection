import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [brands, colors, finishes] = await Promise.all([
      prisma.brands.findMany({
        orderBy: { name: 'asc' },
        select: { name: true }
      }),
      prisma.colors.findMany({
        orderBy: { name: 'asc' },
        select: { name: true }
      }),
      prisma.finishes.findMany({
        orderBy: { name: 'asc' },
        select: { name: true }
      })
    ]);

    return NextResponse.json({
      brands: brands.map(b => b.name),
      colors: colors.map(c => c.name),
      finishes: finishes.map(f => f.name)
    });
  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    );
  }
}
