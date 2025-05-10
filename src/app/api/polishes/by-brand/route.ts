import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand parameter is required' },
        { status: 400 }
      );
    }

    const shoes = await prisma.shoes.findMany({
      where: {
        brand: {
          name: brand
        }
      },
      include: {
        brand: true,
        colors: {
          include: {
            color: true
          }
        },
        dress_style: true,
        shoe_type: true,
        heel_type: true,
        location: true
      }
    });

    return NextResponse.json(shoes.map(shoe => ({
      id: shoe.id,
      imageUrl: shoe.image_url,
      brand: shoe.brand.name,
      colors: shoe.colors.map(c => c.color.name),
      dressStyle: shoe.dress_style.name,
      shoeType: shoe.shoe_type.name,
      heelType: shoe.heel_type.name,
      location: shoe.location.name,
      notes: shoe.notes
    })));
  } catch (error) {
    console.error('Error fetching shoes by brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shoes by brand' },
      { status: 500 }
    );
  }
}
