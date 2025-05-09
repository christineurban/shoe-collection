import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { CollectionStats } from '@/types/stats';

const formatRating = (rating: string): string => {
  return rating.replace('_PLUS', '+').replace('_MINUS', '-');
};

export async function GET() {
  try {
    // Get total polishes
    const totalPolishes = await prisma.nail_polish.count();

    // Get total brands
    const totalBrands = await prisma.brands.count();

    // Get total colors
    const totalColors = await prisma.colors.count();

    // Get total finishes
    const totalFinishes = await prisma.finishes.count();

    // Get most popular brand among new polishes
    const brandsWithNewPolishes = await prisma.brands.findMany({
      select: {
        name: true,
        nail_polish: {
          where: {
            OR: [
              { is_old: false },
              { is_old: null }
            ]
          }
        }
      }
    });

    const brandCounts = brandsWithNewPolishes.map(brand => ({
      name: brand.name,
      count: brand.nail_polish.length
    })).sort((a, b) => b.count - a.count);

    const mostPopularNewBrand = brandCounts.length > 0
      ? brandCounts[0]
      : { name: 'N/A', count: 0 };

    // Get all ratings
    const polishesWithRatings = await prisma.nail_polish.findMany({
      select: {
        rating: true
      }
    });

    // Calculate most common rating
    const ratedPolishes = polishesWithRatings.filter(polish => polish.rating !== null);
    const ratedPolishesCount = ratedPolishes.length;

    const ratingsCount = ratedPolishes.reduce((acc, polish) => {
      const rating = polish.rating as string;
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonRating = Object.entries(ratingsCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Get brand stats with highest count
    const mostCommonBrand = await prisma.brands.findMany({
      include: {
        _count: {
          select: { nail_polish: true }
        }
      },
      orderBy: {
        nail_polish: {
          _count: 'desc'
        }
      },
      take: 1
    });

    // Get color stats with highest count
    const mostCommonColor = await prisma.colors.findMany({
      include: {
        _count: {
          select: { nail_polish: true }
        }
      },
      orderBy: {
        nail_polish: {
          _count: 'desc'
        }
      },
      take: 1
    });

    // Get finish stats with highest count
    const mostCommonFinish = await prisma.finishes.findMany({
      include: {
        _count: {
          select: { nail_polish: true }
        }
      },
      orderBy: {
        nail_polish: {
          _count: 'desc'
        }
      },
      take: 1
    });

    const stats = {
      totalPolishes,
      totalBrands,
      totalColors,
      totalFinishes,
      averageRating: mostCommonRating ? formatRating(mostCommonRating) : null,
      ratedPolishesCount,
      mostPopularNewBrand,
      mostCommonBrand: {
        name: mostCommonBrand[0]?.name || 'N/A',
        count: mostCommonBrand[0]?._count.nail_polish || 0
      },
      mostCommonColor: {
        name: mostCommonColor[0]?.name || 'N/A',
        count: mostCommonColor[0]?._count.nail_polish || 0
      },
      mostCommonFinish: {
        name: mostCommonFinish[0]?.name || 'N/A',
        count: mostCommonFinish[0]?._count.nail_polish || 0
      }
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
