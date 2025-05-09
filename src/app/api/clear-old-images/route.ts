import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Update all records where image_url contains 'googleusercontent'
    const result = await prisma.nail_polish.updateMany({
      where: {
        image_url: {
          contains: 'googleusercontent'
        }
      },
      data: {
        image_url: null,
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: `Cleared ${result.count} old image URLs`,
      data: result
    });

  } catch (error) {
    console.error('Error clearing old images:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear old images',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
