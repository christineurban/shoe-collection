import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Get all the required IDs
    const [brand, color, dressStyle, shoeType, heelType, location] = await Promise.all([
      prisma.brands.findUnique({ where: { name: data.brand } }),
      prisma.colors.findUnique({ where: { name: data.color } }),
      prisma.dress_styles.findUnique({ where: { name: data.dressStyle } }),
      prisma.shoe_types.findUnique({ where: { name: data.shoeType } }),
      prisma.heel_types.findUnique({ where: { name: data.heelType } }),
      prisma.locations.findUnique({ where: { name: data.location } })
    ]);

    if (!brand || !color || !dressStyle || !shoeType || !heelType || !location) {
      return NextResponse.json(
        { error: 'One or more required attributes not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const newShoe = await prisma.shoes.create({
      data: {
        brand_id: brand.id,
        color_id: color.id,
        dress_style_id: dressStyle.id,
        shoe_type_id: shoeType.id,
        heel_type_id: heelType.id,
        location_id: location.id,
        image_url: data.imageUrl,
        notes: data.notes,
        created_at: now,
        updated_at: now
      }
    });

    // Fetch the complete shoe data with relations
    const completeShoe = await prisma.shoes.findUnique({
      where: { id: newShoe.id },
      include: {
        brand: true,
        color: true,
        dress_style: true,
        shoe_type: true,
        heel_type: true,
        location: true
      }
    });

    if (!completeShoe) {
      throw new Error('Failed to fetch created shoe');
    }

    return NextResponse.json({
      id: completeShoe.id,
      imageUrl: completeShoe.image_url,
      brand: completeShoe.brand.name,
      color: completeShoe.color.name,
      dressStyle: completeShoe.dress_style.name,
      shoeType: completeShoe.shoe_type.name,
      heelType: completeShoe.heel_type.name,
      location: completeShoe.location.name,
      notes: completeShoe.notes
    });
  } catch (error) {
    console.error('Error creating shoe:', error);
    return NextResponse.json(
      { error: 'Failed to create shoe' },
      { status: 500 }
    );
  }
}
