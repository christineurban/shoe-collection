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

    // Return a flat Shoe object
    return NextResponse.json({
      id: shoe.id,
      brand: shoe.brand.name,
      imageUrl: shoe.image_url,
      colors: shoe.colors.map((c: any) => c.color.name),
      dressStyle: shoe.dress_style.name,
      shoeType: shoe.shoe_type.name,
      heelType: shoe.heel_type.name,
      location: shoe.location.name,
      notes: shoe.notes,
    });
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
        dress_style_id: dressStyle.id,
        shoe_type_id: shoeType.id,
        heel_type_id: heelType.id,
        location_id: location.id,
        image_url: data.imageUrl,
        notes: data.notes,
        updated_at: new Date(),
        colors: {
          deleteMany: {},
          create: [{
            color_id: color.id,
            updated_at: new Date()
          }]
        }
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
      colors: updatedShoe.colors.map((c: { color: { name: string } }) => c.color.name),
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
    // First get the shoe to get its brand_id
    const shoe = await prisma.shoes.findUnique({
      where: { id: params.id },
      select: { brand_id: true }
    });

    if (!shoe) {
      return NextResponse.json(
        { error: 'Shoe not found' },
        { status: 404 }
      );
    }

    // Delete the shoe
    await prisma.shoes.delete({
      where: { id: params.id }
    });

    // Check if this was the last shoe for this brand
    const remainingShoes = await prisma.shoes.count({
      where: { brand_id: shoe.brand_id }
    });

    // If no shoes left for this brand, delete the brand
    if (remainingShoes === 0) {
      await prisma.brands.delete({
        where: { id: shoe.brand_id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shoe:', error);
    return NextResponse.json(
      { error: 'Failed to delete shoe' },
      { status: 500 }
    );
  }
}
