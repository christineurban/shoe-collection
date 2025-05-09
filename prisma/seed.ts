import { PrismaClient } from '@prisma/client';
import readline from 'readline';

const prisma = new PrismaClient();

async function promptForConfirmation(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\x1b[31m%s\x1b[0m', '⚠️  WARNING: This will delete all existing data in the database.');
  console.log('\x1b[31m%s\x1b[0m', '   Please make sure you have a backup before proceeding.');
  console.log('\x1b[31m%s\x1b[0m', '   Run `npm run backup` to create a backup first.');

  const answer = await new Promise<string>(resolve => {
    rl.question('\nAre you sure you want to proceed? (y/N): ', resolve);
  });

  rl.close();
  return answer.toLowerCase() === 'y';
}

async function main() {
  const shouldProceed = await promptForConfirmation();

  if (!shouldProceed) {
    console.log('Operation cancelled');
    process.exit(0);
  }

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
    'Sorel',
    'Target',
    'Tommy Hilfiger',
    'Ugg',
    'Unknown',
    'Vepose',
    'Yellow Box'
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

  // Create shoes
  const shoes = [
    {
      image_url: null,
      brand: 'Amazon',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Ballet Flat',
      heel_type: 'Flat',
      dress_style: 'Either',
      notes: 'foldable flats'
    },
    {
      image_url: null,
      brand: 'Ugg',
      location: 'Bedroom Closet',
      color: 'Beige',
      shoe_type: 'Boot',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Marc Fisher',
      location: 'Front Closet',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either',
      notes: 'Marc Fisher Women\'s Alva Ankle Boot'
    },
    {
      image_url: null,
      brand: 'Unknown',
      location: 'Front Closet',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Unknown',
      location: 'Front Closet',
      color: 'Beige',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Soda',
      location: 'Front Closet',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Vepose',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Columbia',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Kelsi Dagger',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Franco Sarto',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Dolce Vita',
      location: 'Bedroom Closet',
      color: 'Brown',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Nine West',
      location: 'Bedroom Closet',
      color: 'Brown',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Sam Edelman',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Tommy Hilfiger',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Unknown',
      location: 'Garage',
      color: 'Beige',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Joie',
      location: 'Garage',
      color: 'Beige',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Joie',
      location: 'Garage',
      color: 'Black',
      shoe_type: 'Boot',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Reebok',
      location: 'Front Closet',
      color: 'Black',
      shoe_type: 'Gym',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Altra',
      location: 'Garage',
      color: 'White',
      shoe_type: 'Gym',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Nike',
      location: 'Garage',
      color: 'Purple',
      shoe_type: 'Gym',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Columbia',
      location: 'Bedroom Closet',
      color: 'Gray',
      shoe_type: 'Hiking',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Amazon Essentials',
      location: 'Front Closet',
      color: 'Beige',
      shoe_type: 'Loafer',
      heel_type: 'Flat',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Amazon',
      location: 'Bedroom Closet',
      color: 'Beige',
      shoe_type: 'Mule',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Clarks',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Mule',
      heel_type: 'Heel',
      dress_style: 'Dressy'
    },
    {
      image_url: null,
      brand: 'Dolce Vita',
      location: 'Bedroom Closet',
      color: 'Beige',
      shoe_type: 'Mule',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Ivanka Trump',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Pump',
      heel_type: 'Heel',
      dress_style: 'Dressy'
    },
    {
      image_url: null,
      brand: 'Unknown',
      location: 'Garage',
      color: 'Beige',
      shoe_type: 'Pump',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Old Navy',
      location: 'Front Closet',
      color: 'Black',
      shoe_type: 'Sandal',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Old Navy',
      location: 'Front Closet',
      color: 'Beige',
      shoe_type: 'Sandal',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Yellow Box',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Sandal',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Rainbow',
      location: 'Bedroom Closet',
      color: 'Brown',
      shoe_type: 'Sandal',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Olukai',
      location: 'Bedroom Closet',
      color: 'Beige',
      shoe_type: 'Sandal',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Reef',
      location: 'Bedroom Closet',
      color: 'Brown',
      shoe_type: 'Sandal',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Target',
      location: 'Bedroom Closet',
      color: 'Beige',
      shoe_type: 'Sandal',
      heel_type: 'Flat',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Unknown',
      location: 'Bedroom Closet',
      color: 'Beige',
      shoe_type: 'Sandal',
      heel_type: 'Heel',
      dress_style: 'Either'
    },
    {
      image_url: null,
      brand: 'Unknown',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Sandal',
      heel_type: 'Heel',
      dress_style: 'Dressy'
    },
    {
      image_url: null,
      brand: 'Kelly & Katie',
      location: 'Bedroom Closet',
      color: 'Beige',
      shoe_type: 'Sandal',
      heel_type: 'Heel',
      dress_style: 'Dressy'
    },
    {
      image_url: null,
      brand: 'Unknown',
      location: 'Garage',
      color: 'Silver',
      shoe_type: 'Sandal',
      heel_type: 'Heel',
      dress_style: 'Dressy'
    },
    {
      image_url: null,
      brand: 'Unknown',
      location: 'Garage',
      color: 'Silver',
      shoe_type: 'Sandal',
      heel_type: 'Heel',
      dress_style: 'Dressy'
    },
    {
      image_url: null,
      brand: 'Jessica Simpson',
      location: 'Garage',
      color: 'Black',
      shoe_type: 'Sandal',
      heel_type: 'Heel',
      dress_style: 'Dressy'
    },
    {
      image_url: null,
      brand: 'Jessica Simpson',
      location: 'Garage',
      color: 'Beige',
      shoe_type: 'Sandal',
      heel_type: 'Heel',
      dress_style: 'Dressy'
    },
    {
      image_url: null,
      brand: 'Calvin Klein',
      location: 'Garage',
      color: 'Beige',
      shoe_type: 'Sandal',
      heel_type: 'Heel',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Target',
      location: 'Front Closet',
      color: 'Black',
      shoe_type: 'Sneaker',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Sorel',
      location: 'Front Closet',
      color: 'Black',
      shoe_type: 'Sneaker',
      heel_type: 'Heel',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Hoka',
      location: 'Front Closet',
      color: 'White',
      shoe_type: 'Sneaker',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Skechers',
      location: 'Bedroom Closet',
      color: 'Pink',
      shoe_type: 'Sneaker',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Nike',
      location: 'Bedroom Closet',
      color: 'White',
      shoe_type: 'Sneaker',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Altra',
      location: 'Bedroom Closet',
      color: 'Blue',
      shoe_type: 'Sneaker',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Brooks',
      location: 'Bedroom Closet',
      color: 'Blue',
      shoe_type: 'Sneaker',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Nike',
      location: 'Bedroom Closet',
      color: 'Black',
      shoe_type: 'Sneaker',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'Nike',
      location: 'Bedroom Closet',
      color: 'White',
      shoe_type: 'Sneaker',
      heel_type: 'Flat',
      dress_style: 'Casual'
    },
    {
      image_url: null,
      brand: 'New Balance',
      location: 'Bedroom Closet',
      color: 'Gray',
      shoe_type: 'Sneaker',
      heel_type: 'Flat',
      dress_style: 'Casual'
    }
  ];

  // Create shoes
  for (const shoe of shoes) {
    const brand = await prisma.brands.findUnique({ where: { name: shoe.brand } });
    const color = await prisma.colors.findUnique({ where: { name: shoe.color } });
    const location = await prisma.locations.findUnique({ where: { name: shoe.location } });
    const shoeType = await prisma.shoe_types.findUnique({ where: { name: shoe.shoe_type } });
    const heelType = await prisma.heel_types.findUnique({ where: { name: shoe.heel_type } });
    const dressStyle = await prisma.dress_styles.findUnique({ where: { name: shoe.dress_style } });

    if (!brand || !color || !location || !shoeType || !heelType || !dressStyle) {
      console.error(`Missing reference data for shoe: ${JSON.stringify(shoe)}`);
      continue;
    }

    await prisma.shoes.create({
      data: {
        image_url: shoe.image_url,
        brand_id: brand.id,
        color_id: color.id,
        location_id: location.id,
        shoe_type_id: shoeType.id,
        heel_type_id: heelType.id,
        dress_style_id: dressStyle.id,
        notes: shoe.notes,
        updated_at: now
      }
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
