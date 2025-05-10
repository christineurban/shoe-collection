import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

interface ShoeRecord {
  Image: string;
  Brand: string;
  Location: string;
  Color: string;
  Type: string;
  'Heel or Flat': string;
  'Dress Style': string;
  Notes: string;
}

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

async function seedFromCsv() {
  console.time('Total seeding time');
  const shouldProceed = await promptForConfirmation();

  if (!shouldProceed) {
    console.log('Operation cancelled');
    process.exit(0);
  }

  const stats = {
    totalRows: 0,
    successfullyAdded: 0,
    failedToAdd: 0,
    failures: [] as { brand: string; error: string }[],
  };

  try {
    console.log('Starting CSV read...');
    console.time('CSV read');
    // Read the CSV file
    const csvFilePath = path.join(__dirname, 'seeds', 'shoes.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

    // Parse CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as ShoeRecord[];
    console.timeEnd('CSV read');

    stats.totalRows = records.length;
    console.log(`Found ${stats.totalRows} rows in CSV file`);

    // Clear existing data in correct order
    console.log('Clearing existing data...');
    console.time('Data clearing');
    await prisma.shoes.deleteMany();
    console.log('✓ Shoes deleted');
    await prisma.brands.deleteMany();
    console.log('✓ Brands deleted');
    await prisma.colors.deleteMany();
    console.log('✓ Colors deleted');
    await prisma.locations.deleteMany();
    console.log('✓ Locations deleted');
    await prisma.shoe_types.deleteMany();
    console.log('✓ Shoe types deleted');
    await prisma.heel_types.deleteMany();
    console.log('✓ Heel types deleted');
    await prisma.dress_styles.deleteMany();
    console.log('✓ Dress styles deleted');
    console.timeEnd('Data clearing');

    // Create default records first
    console.log('\nCreating default records...');
    const defaultBrand = await prisma.brands.create({
      data: { name: 'Unknown', updated_at: new Date() },
    });
    const defaultColor = await prisma.colors.create({
      data: { name: 'Unknown', updated_at: new Date() },
    });
    const defaultLocation = await prisma.locations.create({
      data: { name: 'Unknown', updated_at: new Date() },
    });
    const defaultShoeType = await prisma.shoe_types.create({
      data: { name: 'Unknown', updated_at: new Date() },
    });
    const defaultHeelType = await prisma.heel_types.create({
      data: { name: 'Unknown', updated_at: new Date() },
    });
    const defaultDressStyle = await prisma.dress_styles.create({
      data: { name: 'Unknown', updated_at: new Date() },
    });

    // Create brands first
    console.log('\nCreating brands...');
    console.time('Brands creation');
    const brandMap = new Map<string, string>();
    const uniqueBrands = new Set(records.map(s => s.Brand));
    let brandCount = 0;
    for (const brand of uniqueBrands) {
      if (brand && !brandMap.has(brand)) {
        try {
          const brandRecord = await prisma.brands.create({
            data: { name: brand, updated_at: new Date() },
          });
          brandMap.set(brand, brandRecord.id);
        } catch (error) {
          // If brand already exists, find it
          const existingBrand = await prisma.brands.findUnique({
            where: { name: brand },
          });
          if (existingBrand) {
            brandMap.set(brand, existingBrand.id);
          } else {
            brandMap.set(brand, defaultBrand.id);
          }
        }
        brandCount++;
        if (brandCount % 5 === 0) {
          console.log(`Created ${brandCount} brands...`);
        }
      }
    }
    console.log(`✓ Created ${brandCount} brands`);
    console.timeEnd('Brands creation');

    // Create colors
    console.log('\nCreating colors...');
    console.time('Colors creation');
    const colorMap = new Map<string, string>();
    const uniqueColors = new Set(records.map(s => s.Color).filter(Boolean));
    let colorCount = 0;
    for (const color of uniqueColors) {
      if (color && !colorMap.has(color)) {
        try {
          const colorRecord = await prisma.colors.create({
            data: { name: color, updated_at: new Date() },
          });
          colorMap.set(color, colorRecord.id);
        } catch (error) {
          // If color already exists, find it
          const existingColor = await prisma.colors.findUnique({
            where: { name: color },
          });
          if (existingColor) {
            colorMap.set(color, existingColor.id);
          } else {
            colorMap.set(color, defaultColor.id);
          }
        }
        colorCount++;
      }
    }
    console.log(`✓ Created ${colorCount} colors`);
    console.timeEnd('Colors creation');

    // Create locations
    console.log('\nCreating locations...');
    console.time('Locations creation');
    const locationMap = new Map<string, string>();
    const uniqueLocations = new Set(records.map(s => s.Location).filter(Boolean));
    let locationCount = 0;
    for (const location of uniqueLocations) {
      if (location && !locationMap.has(location)) {
        try {
          const locationRecord = await prisma.locations.create({
            data: { name: location, updated_at: new Date() },
          });
          locationMap.set(location, locationRecord.id);
        } catch (error) {
          // If location already exists, find it
          const existingLocation = await prisma.locations.findUnique({
            where: { name: location },
          });
          if (existingLocation) {
            locationMap.set(location, existingLocation.id);
          } else {
            locationMap.set(location, defaultLocation.id);
          }
        }
        locationCount++;
      }
    }
    console.log(`✓ Created ${locationCount} locations`);
    console.timeEnd('Locations creation');

    // Create shoe types
    console.log('\nCreating shoe types...');
    console.time('Shoe types creation');
    const shoeTypeMap = new Map<string, string>();
    const uniqueShoeTypes = new Set(records.map(s => s.Type).filter(Boolean));
    let shoeTypeCount = 0;
    for (const shoeType of uniqueShoeTypes) {
      if (shoeType && !shoeTypeMap.has(shoeType)) {
        try {
          const shoeTypeRecord = await prisma.shoe_types.create({
            data: { name: shoeType, updated_at: new Date() },
          });
          shoeTypeMap.set(shoeType, shoeTypeRecord.id);
        } catch (error) {
          // If shoe type already exists, find it
          const existingShoeType = await prisma.shoe_types.findUnique({
            where: { name: shoeType },
          });
          if (existingShoeType) {
            shoeTypeMap.set(shoeType, existingShoeType.id);
          } else {
            shoeTypeMap.set(shoeType, defaultShoeType.id);
          }
        }
        shoeTypeCount++;
      }
    }
    console.log(`✓ Created ${shoeTypeCount} shoe types`);
    console.timeEnd('Shoe types creation');

    // Create heel types
    console.log('\nCreating heel types...');
    console.time('Heel types creation');
    const heelTypeMap = new Map<string, string>();
    const uniqueHeelTypes = new Set(records.map(s => s['Heel or Flat']).filter(Boolean));
    let heelTypeCount = 0;
    for (const heelType of uniqueHeelTypes) {
      if (heelType && !heelTypeMap.has(heelType)) {
        try {
          const heelTypeRecord = await prisma.heel_types.create({
            data: { name: heelType, updated_at: new Date() },
          });
          heelTypeMap.set(heelType, heelTypeRecord.id);
        } catch (error) {
          // If heel type already exists, find it
          const existingHeelType = await prisma.heel_types.findUnique({
            where: { name: heelType },
          });
          if (existingHeelType) {
            heelTypeMap.set(heelType, existingHeelType.id);
          } else {
            heelTypeMap.set(heelType, defaultHeelType.id);
          }
        }
        heelTypeCount++;
      }
    }
    console.log(`✓ Created ${heelTypeCount} heel types`);
    console.timeEnd('Heel types creation');

    // Create dress styles
    console.log('\nCreating dress styles...');
    console.time('Dress styles creation');
    const dressStyleMap = new Map<string, string>();
    const uniqueDressStyles = new Set(records.map(s => s['Dress Style']).filter(Boolean));
    let dressStyleCount = 0;
    for (const dressStyle of uniqueDressStyles) {
      if (dressStyle && !dressStyleMap.has(dressStyle)) {
        try {
          const dressStyleRecord = await prisma.dress_styles.create({
            data: { name: dressStyle, updated_at: new Date() },
          });
          dressStyleMap.set(dressStyle, dressStyleRecord.id);
        } catch (error) {
          // If dress style already exists, find it
          const existingDressStyle = await prisma.dress_styles.findUnique({
            where: { name: dressStyle },
          });
          if (existingDressStyle) {
            dressStyleMap.set(dressStyle, existingDressStyle.id);
          } else {
            dressStyleMap.set(dressStyle, defaultDressStyle.id);
          }
        }
        dressStyleCount++;
      }
    }
    console.log(`✓ Created ${dressStyleCount} dress styles`);
    console.timeEnd('Dress styles creation');

    // Insert all shoes with relationships
    console.log('\nCreating shoes...');
    console.time('Shoes creation');
    let processedCount = 0;
    for (const shoe of records) {
      try {
        const brandId = shoe.Brand ? brandMap.get(shoe.Brand) || defaultBrand.id : defaultBrand.id;
        const colorId = shoe.Color ? colorMap.get(shoe.Color) || defaultColor.id : defaultColor.id;
        const locationId = shoe.Location ? locationMap.get(shoe.Location) || defaultLocation.id : defaultLocation.id;
        const shoeTypeId = shoe.Type ? shoeTypeMap.get(shoe.Type) || defaultShoeType.id : defaultShoeType.id;
        const heelTypeId = shoe['Heel or Flat'] ? heelTypeMap.get(shoe['Heel or Flat']) || defaultHeelType.id : defaultHeelType.id;
        const dressStyleId = shoe['Dress Style'] ? dressStyleMap.get(shoe['Dress Style']) || defaultDressStyle.id : defaultDressStyle.id;

        await prisma.shoes.create({
          data: {
            image_url: shoe.Image || null,
            brand_id: brandId,
            location_id: locationId,
            shoe_type_id: shoeTypeId,
            heel_type_id: heelTypeId,
            dress_style_id: dressStyleId,
            notes: shoe.Notes || null,
            updated_at: new Date(),
            colors: {
              create: [{
                color_id: colorId,
                created_at: new Date(),
                updated_at: new Date()
              }]
            }
          },
        });
        stats.successfullyAdded++;
        processedCount++;
        if (processedCount % 10 === 0) {
          console.log(`Processed ${processedCount}/${stats.totalRows} shoes...`);
        }
      } catch (error) {
        stats.failedToAdd++;
        stats.failures.push({
          brand: shoe.Brand || 'Unknown',
          error: error instanceof Error ? error.message : String(error),
        });
        console.error(`Error processing shoe ${processedCount + 1}:`, error);
      }
    }
    console.timeEnd('Shoes creation');

    // Print final statistics
    console.log('\nSeeding completed!');
    console.log('-------------------');
    console.log(`Total rows in CSV: ${stats.totalRows}`);
    console.log(`Successfully added: ${stats.successfullyAdded}`);
    console.log(`Failed to add: ${stats.failedToAdd}`);

    if (stats.failures.length > 0) {
      console.log('\nFailures:');
      stats.failures.forEach(failure => {
        console.log(`- ${failure.brand}: ${failure.error}`);
      });
    }

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    console.timeEnd('Total seeding time');
    await prisma.$disconnect();
  }
}

seedFromCsv();
