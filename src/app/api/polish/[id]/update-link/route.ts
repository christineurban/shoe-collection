import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { link } = await request.json();

    if (!link) {
      return NextResponse.json(
        { error: 'Link is required' },
        { status: 400 }
      );
    }

    const updatedShoe = await prisma.shoes.update({
      where: { id: params.id },
      data: { link },
    });

    return NextResponse.json(updatedShoe);
  } catch (error) {
    console.error('Error updating shoe link:', error);
    return NextResponse.json(
      { error: 'Failed to update shoe link' },
      { status: 500 }
    );
  }
}
