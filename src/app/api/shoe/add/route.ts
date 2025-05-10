export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Get or create brand
    let brand = await prisma.brands.findUnique({ where: { name: data.brand } });
    if (!brand) {
      brand = await prisma.brands.create({
        data: {
          name: data.brand,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('Created new brand:', brand.name);
    }

    // Get all the required IDs
    const [dressStyle, shoeType, heelType, location] = await Promise.all([
      prisma.dress_styles.findUnique({ where: { name: data.dressStyle } }),
      prisma.shoe_types.findUnique({ where: { name: data.shoeType } }),
      prisma.heel_types.findUnique({ where: { name: data.heelType } }),
      prisma.locations.findUnique({ where: { name: data.location } })
    ]);

    // Get all color IDs
    const colorRecords = await Promise.all(
      data.colors.map((colorName: string) =>
        prisma.colors.findUnique({ where: { name: colorName } })
      )
    );


    if (!dressStyle || !shoeType || !heelType || !location) {
      return NextResponse.json(
        { error: 'One or more required attributes not found' },
        { status: 404 }
      );
    }

    if (colorRecords.some(record => !record)) {
      return NextResponse.json(
        { error: 'One or more colors not found' },
        { status: 404 }
      );
    }

    const now = new Date();

    const newShoe = await prisma.shoes.create({
      data: {
        brand_id: brand.id,
        dress_style_id: dressStyle.id,
        shoe_type_id: shoeType.id,
        heel_type_id: heelType.id,
        location_id: location.id,
        image_url: data.imageUrl || null,
        notes: data.notes,
        created_at: now,
        updated_at: now,
        colors: {
          create: colorRecords.map(color => ({
            color_id: color!.id,
            created_at: now,
            updated_at: now
          }))
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

    console.log('Successfully created shoe:', newShoe.id);

    return NextResponse.json({
      id: newShoe.id,
      imageUrl: newShoe.image_url,
      brand: newShoe.brand.name,
      colors: newShoe.colors.map(sc => sc.color.name),
      dressStyle: newShoe.dress_style.name,
      shoeType: newShoe.shoe_type.name,
      heelType: newShoe.heel_type.name,
      location: newShoe.location.name,
      notes: newShoe.notes
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create shoe' },
      { status: 500 }
    );
  }
}
