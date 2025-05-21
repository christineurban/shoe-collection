export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate all required fields
    const requiredFields = ['brand', 'colors', 'dressStyle', 'shoeType', 'heelType', 'location'];
    const missingFields = requiredFields.filter(field => !data[field] || (field === 'colors' && data[field].length === 0));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

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

    // Get or create required attributes
    const [dressStyle, shoeType, heelType, location] = await Promise.all([
      prisma.dress_styles.findUnique({ where: { name: data.dressStyle } }).then(style => {
        if (!style) {
          return prisma.dress_styles.create({
            data: {
              name: data.dressStyle,
              created_at: new Date(),
              updated_at: new Date()
            }
          });
        }
        return style;
      }),
      prisma.shoe_types.findUnique({ where: { name: data.shoeType } }).then(type => {
        if (!type) {
          return prisma.shoe_types.create({
            data: {
              name: data.shoeType,
              created_at: new Date(),
              updated_at: new Date()
            }
          });
        }
        return type;
      }),
      prisma.heel_types.findUnique({ where: { name: data.heelType } }).then(type => {
        if (!type) {
          return prisma.heel_types.create({
            data: {
              name: data.heelType,
              created_at: new Date(),
              updated_at: new Date()
            }
          });
        }
        return type;
      }),
      prisma.locations.findUnique({ where: { name: data.location } }).then(loc => {
        if (!loc) {
          return prisma.locations.create({
            data: {
              name: data.location,
              created_at: new Date(),
              updated_at: new Date()
            }
          });
        }
        return loc;
      })
    ]);

    // Get or create colors
    const colorRecords = await Promise.all(
      data.colors.map(async (colorName: string) => {
        let color = await prisma.colors.findUnique({ where: { name: colorName } });
        if (!color) {
          color = await prisma.colors.create({
            data: {
              name: colorName,
              created_at: new Date(),
              updated_at: new Date()
            }
          });
        }
        return color;
      })
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
  } catch {
    return NextResponse.json(
      { error: 'Failed to create shoe' },
      { status: 500 }
    );
  }
}
