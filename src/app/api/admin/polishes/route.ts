import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const shoes = await prisma.shoes.findMany({
      include: {
        brand: true,
        colors: {
          include: {
            color: true
          }
        },
        location: true,
        shoe_type: true,
        heel_type: true,
        dress_style: true
      }
    });

    return NextResponse.json({
      shoes
    });
  } catch (error) {
    console.error('Error fetching shoes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shoes' },
      { status: 500 }
    );
  }
}
