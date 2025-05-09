import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brands.findMany({
      include: {
        nail_polish: {
          select: {
            id: true,
            name: true,
            is_old: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands with polishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands with polishes' },
      { status: 500 }
    );
  }
}
