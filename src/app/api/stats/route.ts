import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalShoes = await prisma.shoes.count();

    const shoes = await prisma.shoes.findMany({
      include: {
        brand: true,
        color: true,
        dress_style: true,
        shoe_type: true,
        heel_type: true,
        location: true
      }
    });

    // Calculate counts for each attribute type
    const brandCounts = shoes.reduce((acc, shoe) => {
      acc[shoe.brand.name] = (acc[shoe.brand.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colorCounts = shoes.reduce((acc, shoe) => {
      acc[shoe.color.name] = (acc[shoe.color.name] || 0) + 1;
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

    const stats = {
      totalShoes,
      totalBrands: Object.keys(brandCounts).length,
      totalColors: Object.keys(colorCounts).length,
      totalDressStyles: Object.keys(dressStyleCounts).length,
      totalShoeTypes: Object.keys(shoeTypeCounts).length,
      totalHeelTypes: Object.keys(heelTypeCounts).length,
      totalLocations: Object.keys(locationCounts).length,
      mostCommonBrand: findMostCommon(brandCounts),
      mostCommonColor: findMostCommon(colorCounts),
      mostCommonDressStyle: findMostCommon(dressStyleCounts),
      mostCommonShoeType: findMostCommon(shoeTypeCounts),
      mostCommonHeelType: findMostCommon(heelTypeCounts),
      mostCommonLocation: findMostCommon(locationCounts),
      brands: Object.entries(brandCounts).map(([name, count]) => ({ name, count })),
      colors: Object.entries(colorCounts).map(([name, count]) => ({ name, count })),
      dressStyles: Object.entries(dressStyleCounts).map(([name, count]) => ({ name, count })),
      shoeTypes: Object.entries(shoeTypeCounts).map(([name, count]) => ({ name, count })),
      heelTypes: Object.entries(heelTypeCounts).map(([name, count]) => ({ name, count })),
      locations: Object.entries(locationCounts).map(([name, count]) => ({ name, count }))
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
