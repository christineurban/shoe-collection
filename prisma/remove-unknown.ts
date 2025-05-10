import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeUnknownEntries() {
  try {
    console.log('Checking for shoes using "Unknown" values...');

    // Check for shoes using Unknown colors
    const shoesWithUnknownColor = await prisma.shoes.findMany({
      where: {
        colors: {
          some: {
            color: {
              name: 'Unknown'
            }
          }
        }
      }
    });

    // Check for shoes using Unknown dress styles
    const shoesWithUnknownDressStyle = await prisma.shoes.findMany({
      where: {
        dress_style: {
          name: 'Unknown'
        }
      }
    });

    // Check for shoes using Unknown shoe types
    const shoesWithUnknownShoeType = await prisma.shoes.findMany({
      where: {
        shoe_type: {
          name: 'Unknown'
        }
      }
    });

    // Check for shoes using Unknown heel types
    const shoesWithUnknownHeelType = await prisma.shoes.findMany({
      where: {
        heel_type: {
          name: 'Unknown'
        }
      }
    });

    // Check for shoes using Unknown locations
    const shoesWithUnknownLocation = await prisma.shoes.findMany({
      where: {
        location: {
          name: 'Unknown'
        }
      }
    });

    // Log any shoes that are using Unknown values
    if (shoesWithUnknownColor.length > 0) {
      console.log(`Found ${shoesWithUnknownColor.length} shoes using Unknown colors. IDs:`, shoesWithUnknownColor.map(s => s.id));
    }
    if (shoesWithUnknownDressStyle.length > 0) {
      console.log(`Found ${shoesWithUnknownDressStyle.length} shoes using Unknown dress styles. IDs:`, shoesWithUnknownDressStyle.map(s => s.id));
    }
    if (shoesWithUnknownShoeType.length > 0) {
      console.log(`Found ${shoesWithUnknownShoeType.length} shoes using Unknown shoe types. IDs:`, shoesWithUnknownShoeType.map(s => s.id));
    }
    if (shoesWithUnknownHeelType.length > 0) {
      console.log(`Found ${shoesWithUnknownHeelType.length} shoes using Unknown heel types. IDs:`, shoesWithUnknownHeelType.map(s => s.id));
    }
    if (shoesWithUnknownLocation.length > 0) {
      console.log(`Found ${shoesWithUnknownLocation.length} shoes using Unknown locations. IDs:`, shoesWithUnknownLocation.map(s => s.id));
    }

    // If any shoes are using Unknown values, stop the process
    if (shoesWithUnknownColor.length > 0 ||
        shoesWithUnknownDressStyle.length > 0 ||
        shoesWithUnknownShoeType.length > 0 ||
        shoesWithUnknownHeelType.length > 0 ||
        shoesWithUnknownLocation.length > 0) {
      console.log('\n⚠️  WARNING: Found shoes using "Unknown" values. Cannot safely remove Unknown entries.');
      console.log('Please update these shoes first to use valid values.');
      return;
    }

    console.log('\nNo shoes found using "Unknown" values. Proceeding with removal...');

    // Remove from colors
    const deletedColors = await prisma.colors.deleteMany({
      where: { name: 'Unknown' }
    });
    console.log(`Deleted ${deletedColors.count} "Unknown" colors`);

    // Remove from dress styles
    const deletedDressStyles = await prisma.dress_styles.deleteMany({
      where: { name: 'Unknown' }
    });
    console.log(`Deleted ${deletedDressStyles.count} "Unknown" dress styles`);

    // Remove from shoe types
    const deletedShoeTypes = await prisma.shoe_types.deleteMany({
      where: { name: 'Unknown' }
    });
    console.log(`Deleted ${deletedShoeTypes.count} "Unknown" shoe types`);

    // Remove from heel types
    const deletedHeelTypes = await prisma.heel_types.deleteMany({
      where: { name: 'Unknown' }
    });
    console.log(`Deleted ${deletedHeelTypes.count} "Unknown" heel types`);

    // Remove from locations
    const deletedLocations = await prisma.locations.deleteMany({
      where: { name: 'Unknown' }
    });
    console.log(`Deleted ${deletedLocations.count} "Unknown" locations`);

    console.log('\nSuccessfully removed all "Unknown" entries');
  } catch (error) {
    console.error('Error removing "Unknown" entries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeUnknownEntries();
