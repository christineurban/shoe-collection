'use server';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalShoes = await prisma.shoes.count();

    // Get all brands with their shoe counts
    const brands = await prisma.brands.findMany({
      include: {
        shoes: true
      }
    });

    // Get all colors with their shoe counts
    const colors = await prisma.colors.findMany({
      include: {
        shoes: true
      }
    });

    // Get all dress styles with their shoe counts
    const dressStyles = await prisma.dress_styles.findMany({
      include: {
        shoes: true
      }
    });

    // Get all shoe types with their shoe counts
    const shoeTypes = await prisma.shoe_types.findMany({
      include: {
        shoes: true
      }
    });

    // Get all heel types with their shoe counts
    const heelTypes = await prisma.heel_types.findMany({
      include: {
        shoes: true
      }
    });

    // Get all locations with their shoe counts
    const locations = await prisma.locations.findMany({
      include: {
        shoes: true
      }
    });

    const brandsData = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      count: brand.shoes.length,
      percentage: Number(((brand.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const colorsData = colors.map(color => ({
      id: color.id,
      name: color.name,
      count: color.shoes.length,
      percentage: Number(((color.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const dressStylesData = dressStyles.map(style => ({
      id: style.id,
      name: style.name,
      count: style.shoes.length,
      percentage: Number(((style.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const shoeTypesData = shoeTypes.map(type => ({
      id: type.id,
      name: type.name,
      count: type.shoes.length,
      percentage: Number(((type.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const heelTypesData = heelTypes.map(type => ({
      id: type.id,
      name: type.name,
      count: type.shoes.length,
      percentage: Number(((type.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const locationsData = locations.map(location => ({
      id: location.id,
      name: location.name,
      count: location.shoes.length,
      percentage: Number(((location.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    return NextResponse.json({
      brands: brandsData,
      colors: colorsData,
      dressStyles: dressStylesData,
      shoeTypes: shoeTypesData,
      heelTypes: heelTypesData,
      locations: locationsData
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

    if (!type || !name || !['brand', 'color', 'dressStyle', 'shoeType', 'heelType', 'location'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type or name' },
        { status: 400 }
      );
    }

    let result;
    switch (type) {
      case 'brand':
        await prisma.brands.create({
          data: {
            name,
            updated_at: new Date()
          }
        });
        break;
      case 'color':
        await prisma.colors.create({
          data: {
            name,
            updated_at: new Date()
          }
        });
        break;
      case 'dressStyle':
        await prisma.dress_styles.create({
          data: {
            name,
            updated_at: new Date()
          }
        });
        break;
      case 'shoeType':
        await prisma.shoe_types.create({
          data: {
            name,
            updated_at: new Date()
          }
        });
        break;
      case 'heelType':
        await prisma.heel_types.create({
          data: {
            name,
            updated_at: new Date()
          }
        });
        break;
      case 'location':
        await prisma.locations.create({
          data: {
            name,
            updated_at: new Date()
          }
        });
        break;
    }

    // Fetch updated lists and counts after creation
    const totalShoes = await prisma.shoes.count();

    const brands = await prisma.brands.findMany({ include: { shoes: true } });
    const brandsData = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      count: brand.shoes.length,
      percentage: Number(((brand.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const colors = await prisma.colors.findMany({ include: { shoes: true } });
    const colorsData = colors.map(color => ({
      id: color.id,
      name: color.name,
      count: color.shoes.length,
      percentage: Number(((color.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const dressStyles = await prisma.dress_styles.findMany({ include: { shoes: true } });
    const dressStylesData = dressStyles.map(style => ({
      id: style.id,
      name: style.name,
      count: style.shoes.length,
      percentage: Number(((style.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const shoeTypes = await prisma.shoe_types.findMany({ include: { shoes: true } });
    const shoeTypesData = shoeTypes.map(type => ({
      id: type.id,
      name: type.name,
      count: type.shoes.length,
      percentage: Number(((type.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const heelTypes = await prisma.heel_types.findMany({ include: { shoes: true } });
    const heelTypesData = heelTypes.map(type => ({
      id: type.id,
      name: type.name,
      count: type.shoes.length,
      percentage: Number(((type.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const locations = await prisma.locations.findMany({ include: { shoes: true } });
    const locationsData = locations.map(location => ({
      id: location.id,
      name: location.name,
      count: location.shoes.length,
      percentage: Number(((location.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    return NextResponse.json({
      brands: brandsData,
      colors: colorsData,
      dressStyles: dressStylesData,
      shoeTypes: shoeTypesData,
      heelTypes: heelTypesData,
      locations: locationsData
    });
  } catch (error) {
    console.error('Error creating attribute:', error);
    return NextResponse.json(
      { error: 'Failed to create attribute' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id || !['brand', 'color', 'dressStyle', 'shoeType', 'heelType', 'location'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type or id' },
        { status: 400 }
      );
    }

    // Check if the attribute is in use
    let inUse = false;
    switch (type) {
      case 'brand':
        inUse = (await prisma.shoes.count({ where: { brand_id: id } })) > 0;
        break;
      case 'color':
        inUse = (await prisma.shoe_colors.count({ where: { color_id: id } })) > 0;
        break;
      case 'dressStyle':
        inUse = (await prisma.shoes.count({ where: { dress_style_id: id } })) > 0;
        break;
      case 'shoeType':
        inUse = (await prisma.shoes.count({ where: { shoe_type_id: id } })) > 0;
        break;
      case 'heelType':
        inUse = (await prisma.shoes.count({ where: { heel_type_id: id } })) > 0;
        break;
      case 'location':
        inUse = (await prisma.shoes.count({ where: { location_id: id } })) > 0;
        break;
    }

    if (inUse) {
      return NextResponse.json(
        { error: 'Cannot delete attribute that is in use' },
        { status: 400 }
      );
    }

    let result;
    switch (type) {
      case 'brand':
        result = await prisma.brands.delete({ where: { id } });
        break;
      case 'color':
        result = await prisma.colors.delete({ where: { id } });
        break;
      case 'dressStyle':
        result = await prisma.dress_styles.delete({ where: { id } });
        break;
      case 'shoeType':
        result = await prisma.shoe_types.delete({ where: { id } });
        break;
      case 'heelType':
        result = await prisma.heel_types.delete({ where: { id } });
        break;
      case 'location':
        result = await prisma.locations.delete({ where: { id } });
        break;
    }

    // Fetch updated lists and counts after deletion
    const totalShoes = await prisma.shoes.count();

    const brands = await prisma.brands.findMany({ include: { shoes: true } });
    const brandsData = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      count: brand.shoes.length,
      percentage: Number(((brand.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const colors = await prisma.colors.findMany({ include: { shoes: true } });
    const colorsData = colors.map(color => ({
      id: color.id,
      name: color.name,
      count: color.shoes.length,
      percentage: Number(((color.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const dressStyles = await prisma.dress_styles.findMany({ include: { shoes: true } });
    const dressStylesData = dressStyles.map(style => ({
      id: style.id,
      name: style.name,
      count: style.shoes.length,
      percentage: Number(((style.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const shoeTypes = await prisma.shoe_types.findMany({ include: { shoes: true } });
    const shoeTypesData = shoeTypes.map(type => ({
      id: type.id,
      name: type.name,
      count: type.shoes.length,
      percentage: Number(((type.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const heelTypes = await prisma.heel_types.findMany({ include: { shoes: true } });
    const heelTypesData = heelTypes.map(type => ({
      id: type.id,
      name: type.name,
      count: type.shoes.length,
      percentage: Number(((type.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    const locations = await prisma.locations.findMany({ include: { shoes: true } });
    const locationsData = locations.map(location => ({
      id: location.id,
      name: location.name,
      count: location.shoes.length,
      percentage: Number(((location.shoes.length / totalShoes) * 100).toFixed(1))
    }));

    return NextResponse.json({
      brands: brandsData,
      colors: colorsData,
      dressStyles: dressStylesData,
      shoeTypes: shoeTypesData,
      heelTypes: heelTypesData,
      locations: locationsData
    });
  } catch (error) {
    console.error('Error deleting attribute:', error);
    return NextResponse.json(
      { error: 'Failed to delete attribute' },
      { status: 500 }
    );
  }
}
