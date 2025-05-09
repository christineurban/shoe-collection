import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const shoes = await prisma.shoes.findMany({
      include: {
        brand: true,
        color: true,
        location: true,
        shoe_type: true,
        heel_type: true,
        dress_style: true
      }
    });
    console.log('Shoes:', JSON.stringify(shoes, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
