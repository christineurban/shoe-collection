import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brands.findMany({
      include: {
        shoes: {
          select: {
            id: true,
            image_url: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands with shoes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands with shoes' },
      { status: 500 }
    );
  }
}
