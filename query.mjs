import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn']
});

async function main() {
  // Query brands
  const brands = await prisma.brands.findMany();
  console.log('\nBrands:', brands.length);
  console.log(brands);

  // Query shoes
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
  console.log('\nShoes:', shoes.length);
  console.log(JSON.stringify(shoes, null, 2));

  // Query other reference data
  const colors = await prisma.colors.findMany();
  console.log('\nColors:', colors.length);

  const locations = await prisma.locations.findMany();
  console.log('\nLocations:', locations.length);

  const shoeTypes = await prisma.shoe_types.findMany();
  console.log('\nShoe Types:', shoeTypes.length);

  const heelTypes = await prisma.heel_types.findMany();
  console.log('\nHeel Types:', heelTypes.length);

  const dressStyles = await prisma.dress_styles.findMany();
  console.log('\nDress Styles:', dressStyles.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
