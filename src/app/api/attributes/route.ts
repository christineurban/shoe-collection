'use server';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total polish count first
    const totalPolishes = await prisma.nail_polish.count();

    const [brands, colors, finishes] = await Promise.all([
      prisma.brands.findMany({
        include: {
          nail_polish: true
        },
        orderBy: { name: 'asc' }
      }),
      prisma.colors.findMany({
        include: {
          nail_polish: true
        },
        orderBy: { name: 'asc' }
      }),
      prisma.finishes.findMany({
        include: {
          nail_polish: true
        },
        orderBy: { name: 'asc' }
      })
    ]);

    return NextResponse.json({
      brands: brands.map(brand => ({
        id: brand.id,
        name: brand.name,
        count: brand.nail_polish.length,
        percentage: Number(((brand.nail_polish.length / totalPolishes) * 100).toFixed(1))
      })),
      colors: colors.map(color => ({
        id: color.id,
        name: color.name,
        count: color.nail_polish.length,
        percentage: Number(((color.nail_polish.length / totalPolishes) * 100).toFixed(1))
      })),
      finishes: finishes.map(finish => ({
        id: finish.id,
        name: finish.name,
        count: finish.nail_polish.length,
        percentage: Number(((finish.nail_polish.length / totalPolishes) * 100).toFixed(1))
      }))
    });
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attributes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { type, name } = await request.json();

    if (!type || !name || !['brand', 'color', 'finish'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    let result;
    switch (type) {
      case 'brand':
        result = await prisma.brands.create({
          data: {
            name,
            updated_at: new Date()
          }
        });
        break;
      case 'color':
        result = await prisma.colors.create({
          data: {
            name,
            updated_at: new Date()
          }
        });
        break;
      case 'finish':
        result = await prisma.finishes.create({
          data: {
            name,
            updated_at: new Date()
          }
        });
        break;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create attribute' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { type, id } = await request.json();

    if (!type || !id || !['brand', 'color', 'finish'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Check if the attribute is in use
    let inUse = false;
    switch (type) {
      case 'brand':
        inUse = (await prisma.nail_polish.count({ where: { brand_id: id } })) > 0;
        break;
      case 'color':
        inUse = (await prisma.nail_polish_color.count({ where: { color_id: id } })) > 0;
        break;
      case 'finish':
        inUse = (await prisma.nail_polish_finish.count({ where: { finish_id: id } })) > 0;
        break;
    }

    if (inUse) {
      return NextResponse.json(
        { error: 'Cannot delete attribute that is in use' },
        { status: 400 }
      );
    }

    // Delete the attribute
    let result;
    switch (type) {
      case 'brand':
        result = await prisma.brands.delete({ where: { id } });
        break;
      case 'color':
        result = await prisma.colors.delete({ where: { id } });
        break;
      case 'finish':
        result = await prisma.finishes.delete({ where: { id } });
        break;
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete attribute' },
      { status: 500 }
    );
  }
}
