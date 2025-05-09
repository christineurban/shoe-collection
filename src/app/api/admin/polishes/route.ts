import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const polishes = await prisma.nail_polish.findMany({
      select: {
        id: true,
        name: true,
        brands: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        brands: {
          name: 'asc'
        }
      }
    });

    return NextResponse.json({
      polishes
    });
  } catch (error) {
    console.error('Error fetching polishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polishes' },
      { status: 500 }
    );
  }
}
