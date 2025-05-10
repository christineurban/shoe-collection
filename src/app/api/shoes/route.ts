export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Shoe } from '@/types/shoe';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasImage = searchParams.get('hasImage');
    const search = searchParams.get('search') || '';
    const brands = searchParams.getAll('brand');
    const colors = searchParams.getAll('color');
    const dressStyles = searchParams.getAll('dressStyle');
    const shoeTypes = searchParams.getAll('shoeType');
    const heelTypes = searchParams.getAll('heelType');
    const locations = searchParams.getAll('location');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build the where clause
    const where: any = {};

    // Add image filter if provided
    if (hasImage !== null) {
      if (hasImage === 'true') {
        where.AND = [{
          NOT: {
            OR: [
              { image_url: null },
              { image_url: 'n/a' }
            ]
          }
        }];
      } else {
        where.AND = [{
          image_url: null // Only include shoes with no image, exclude 'n/a'
        }];
      }
    }

    // Add search filter if provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Add filters using the name fields directly
    if (brands.length > 0) {
      where.brand = { name: { in: brands } };
    }

    if (colors.length > 0) {
      where.color = { name: { in: colors } };
    }

    if (dressStyles.length > 0) {
      where.dress_style = { name: { in: dressStyles } };
    }

    if (shoeTypes.length > 0) {
      where.shoe_type = { name: { in: shoeTypes } };
    }

    if (heelTypes.length > 0) {
      where.heel_type = { name: { in: heelTypes } };
    }

    if (locations.length > 0) {
      where.location = { name: { in: locations } };
    }

    // Get all shoes that match the filters and total count in a single query
    const [shoes, total] = await Promise.all([
      prisma.shoes.findMany({
        where,
        include: {
          brand: true,
          color: true,
          dress_style: true,
          shoe_type: true,
          heel_type: true,
          location: true
        },
        orderBy: {
          created_at: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.shoes.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      shoes: shoes.map(shoe => ({
        id: shoe.id,
        imageUrl: shoe.image_url,
        brand: shoe.brand.name,
        color: shoe.color.name,
        dressStyle: shoe.dress_style.name,
        shoeType: shoe.shoe_type.name,
        heelType: shoe.heel_type.name,
        location: shoe.location.name,
        noImageAvailable: shoe.image_url === 'n/a'
      })),
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching shoes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shoes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as Shoe;

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

    // Create the shoe record with all relations
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
        created_at: new Date(),
        updated_at: new Date()
      },
      include: {
        brand: true,
        color: true,
        dress_style: true,
        shoe_type: true,
        heel_type: true,
        location: true
      }
    });

    return NextResponse.json(newShoe);
  } catch (error) {
    console.error('Error creating shoe:', error);
    return NextResponse.json(
      { error: 'Failed to create shoe' },
      { status: 500 }
    );
  }
}
