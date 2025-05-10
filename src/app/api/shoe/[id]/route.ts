import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shoe = await prisma.shoes.findUnique({
      where: { id: params.id },
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

    if (!shoe) {
      return NextResponse.json(
        { error: 'Shoe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(shoe);
  } catch (error) {
    console.error('Error fetching shoe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shoe' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const updatedShoe = await prisma.shoes.update({
      where: { id: params.id },
      data: {
        brand_id: brand.id,
        color_id: color.id,
        dress_style_id: dressStyle.id,
        shoe_type_id: shoeType.id,
        heel_type_id: heelType.id,
        location_id: location.id,
        image_url: data.imageUrl,
        notes: data.notes,
        updated_at: new Date()
      },
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
      id: updatedShoe.id,
      imageUrl: updatedShoe.image_url,
      brand: updatedShoe.brand.name,
      color: updatedShoe.colors[0].color.name,
      dressStyle: updatedShoe.dress_style.name,
      shoeType: updatedShoe.shoe_type.name,
      heelType: updatedShoe.heel_type.name,
      location: updatedShoe.location.name,
      notes: updatedShoe.notes
    });
  } catch (error) {
    console.error('Error updating shoe:', error);
    return NextResponse.json(
      { error: 'Failed to update shoe' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.shoes.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shoe:', error);
    return NextResponse.json(
      { error: 'Failed to delete shoe' },
      { status: 500 }
    );
  }
}
