import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Brands
  const brands = [
    'Altra',
    'Amazon',
    'Amazon Essentials',
    'Brooks',
    'Calvin Klein',
    'Clarks',
    'Cole Haan',
    'Columbia',
    'Dolce Vita',
    'Ecco',
    'Franco Sarto',
    'Hoka',
    'Ivanka Trump',
    'Jessica Simpson',
    'Joie',
    'Kelly & Katie',
    'Kelsi Dagger',
    'Marc Fisher',
    'New Balance',
    'Nike',
    'Nine West',
    'Old Navy',
    'Olukai',
    'Rainbow',
    'Reebok',
    'Reef',
    'Sam Edelman',
    'Skechers',
    'Soda',
    'Tommy Hilfiger',
    'Ugg',
    'Vepose',
  ];

  // Colors
  const colors = [
    'Red',
    'Pink',
    'Blue',
    'Purple',
    'Brown',
    'Beige',
    'Gold',
    'Silver',
    'Black',
    'Gray',
    'White',
  ];

  // Locations
  const locations = [
    'Bedroom Closet',
    'Front Closet',
    'Garage',
  ];

  // Shoe Types
  const shoeTypes = [
    'Boot',
    'Sandal',
    'Pump',
    'Mule',
    'Loafer',
    'Ballet Flat',
    'Sneaker',
    'Gym',
    'Hiking',
  ];

  // Heel Types
  const heelTypes = [
    'Heel',
    'Flat',
  ];

  // Dress Styles
  const dressStyles = [
    'Either',
    'Casual',
    'Dressy',
  ];

  const now = new Date();

  // Create all lookup values
  for (const brand of brands) {
    await prisma.brands.upsert({
      where: { name: brand },
      update: {},
      create: {
        name: brand,
        updated_at: now
      },
    });
  }

  for (const color of colors) {
    await prisma.colors.upsert({
      where: { name: color },
      update: {},
      create: {
        name: color,
        updated_at: now
      },
    });
  }

  for (const location of locations) {
    await prisma.locations.upsert({
      where: { name: location },
      update: {},
      create: {
        name: location,
        updated_at: now
      },
    });
  }

  for (const shoeType of shoeTypes) {
    await prisma.shoe_types.upsert({
      where: { name: shoeType },
      update: {},
      create: {
        name: shoeType,
        updated_at: now
      },
    });
  }

  for (const heelType of heelTypes) {
    await prisma.heel_types.upsert({
      where: { name: heelType },
      update: {},
      create: {
        name: heelType,
        updated_at: now
      },
    });
  }

  for (const dressStyle of dressStyles) {
    await prisma.dress_styles.upsert({
      where: { name: dressStyle },
      update: {},
      create: {
        name: dressStyle,
        updated_at: now
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
