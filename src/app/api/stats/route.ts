import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalShoes = await prisma.shoes.count();

    // Get all brands, colors, etc. first
    const allBrands = await prisma.brands.findMany();
    const allColors = await prisma.colors.findMany();
    const allDressStyles = await prisma.dress_styles.findMany();
    const allShoeTypes = await prisma.shoe_types.findMany();
    const allHeelTypes = await prisma.heel_types.findMany();
    const allLocations = await prisma.locations.findMany();

    const shoes = await prisma.shoes.findMany({
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

    // Calculate counts for each attribute type
    const brandCounts = shoes.reduce((acc, shoe) => {
      acc[shoe.brand.name] = (acc[shoe.brand.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colorCounts = shoes.reduce((acc, shoe) => {
      acc[shoe.colors[0].color.name] = (acc[shoe.colors[0].color.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dressStyleCounts = shoes.reduce((acc, shoe) => {
      acc[shoe.dress_style.name] = (acc[shoe.dress_style.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const shoeTypeCounts = shoes.reduce((acc, shoe) => {
      acc[shoe.shoe_type.name] = (acc[shoe.shoe_type.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const heelTypeCounts = shoes.reduce((acc, shoe) => {
      acc[shoe.heel_type.name] = (acc[shoe.heel_type.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const locationCounts = shoes.reduce((acc, shoe) => {
      acc[shoe.location.name] = (acc[shoe.location.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Helper function to find most common attribute
    const findMostCommon = (counts: Record<string, number>) => {
      const entries = Object.entries(counts);
      if (entries.length === 0) return { name: '', count: 0 };
      return entries.reduce((max, [name, count]) =>
        count > max.count ? { name, count } : max,
        { name: '', count: 0 }
      );
    };

    // Create detailed lists including unused attributes with count 0
    const brands = allBrands.map(brand => ({
      name: brand.name,
      count: brandCounts[brand.name] || 0
    }));

    const colors = allColors.map(color => ({
      name: color.name,
      count: colorCounts[color.name] || 0
    }));

    const dressStyles = allDressStyles.map(style => ({
      name: style.name,
      count: dressStyleCounts[style.name] || 0
    }));

    const shoeTypes = allShoeTypes.map(type => ({
      name: type.name,
      count: shoeTypeCounts[type.name] || 0
    }));

    const heelTypes = allHeelTypes.map(type => ({
      name: type.name,
      count: heelTypeCounts[type.name] || 0
    }));

    const locations = allLocations.map(location => ({
      name: location.name,
      count: locationCounts[location.name] || 0
    }));

    const stats = {
      totalShoes,
      totalBrands: brands.filter(b => b.count > 0).length,
      totalColors: colors.filter(c => c.count > 0).length,
      totalDressStyles: dressStyles.filter(d => d.count > 0).length,
      totalShoeTypes: shoeTypes.filter(s => s.count > 0).length,
      totalHeelTypes: heelTypes.filter(h => h.count > 0).length,
      totalLocations: locations.filter(l => l.count > 0).length,
      mostCommonBrand: findMostCommon(brandCounts),
      mostCommonColor: findMostCommon(colorCounts),
      mostCommonDressStyle: findMostCommon(dressStyleCounts),
      mostCommonShoeType: findMostCommon(shoeTypeCounts),
      mostCommonHeelType: findMostCommon(heelTypeCounts),
      mostCommonLocation: findMostCommon(locationCounts),
      brands,
      colors,
      dressStyles,
      shoeTypes,
      heelTypes,
      locations
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
