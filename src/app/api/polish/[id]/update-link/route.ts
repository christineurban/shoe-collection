import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
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

    const updatedPolish = await prisma.nail_polish.update({
      where: { id: params.id },
      data: {
        link,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedPolish);
  } catch (error) {
    console.error('Error updating polish link:', error);
    return NextResponse.json(
      { error: 'Failed to update polish link' },
      { status: 500 }
    );
  }
}
