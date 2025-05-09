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

    const stats = {
      totalShoes,
      brands: Object.entries(
        shoes.reduce((acc, shoe) => {
          acc[shoe.brand.name] = (acc[shoe.brand.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => ({ name, count })),
      colors: Object.entries(
        shoes.reduce((acc, shoe) => {
          acc[shoe.color.name] = (acc[shoe.color.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => ({ name, count })),
      dressStyles: Object.entries(
        shoes.reduce((acc, shoe) => {
          acc[shoe.dress_style.name] = (acc[shoe.dress_style.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => ({ name, count })),
      shoeTypes: Object.entries(
        shoes.reduce((acc, shoe) => {
          acc[shoe.shoe_type.name] = (acc[shoe.shoe_type.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => ({ name, count })),
      heelTypes: Object.entries(
        shoes.reduce((acc, shoe) => {
          acc[shoe.heel_type.name] = (acc[shoe.heel_type.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => ({ name, count })),
      locations: Object.entries(
        shoes.reduce((acc, shoe) => {
          acc[shoe.location.name] = (acc[shoe.location.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => ({ name, count }))
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
