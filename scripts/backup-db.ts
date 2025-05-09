import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

const MAX_BACKUPS = 30; // Keep last 30 days of backups

async function cleanOldBackups(backupsDir: string) {
  if (!fs.existsSync(backupsDir)) return;

  const backups = fs.readdirSync(backupsDir)
    .filter(f => fs.statSync(path.join(backupsDir, f)).isDirectory())
    .sort((a, b) => b.localeCompare(a)); // Sort newest to oldest

  // Remove old backups beyond MAX_BACKUPS
  if (backups.length > MAX_BACKUPS) {
    backups.slice(MAX_BACKUPS).forEach(backup => {
      const backupPath = path.join(backupsDir, backup);
      fs.rmSync(backupPath, { recursive: true, force: true });
      console.log(`Removed old backup: ${backup}`);
    });
  }
}

async function compressFile(inputPath: string, outputPath: string) {
  const gzip = createGzip();
  const source = fs.createReadStream(inputPath);
  const destination = fs.createWriteStream(outputPath);

  await pipeline(source, gzip, destination);
  fs.unlinkSync(inputPath); // Remove original file after compression
}

async function backupTable(tableName: string, query: () => Promise<any>, backupDir: string) {
  try {
    console.log(`Backing up ${tableName}...`);
    const data = await query();

    // Write uncompressed file first
    const tempPath = path.join(backupDir, `${tableName}.json`);
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));

    // Compress the file
    const compressedPath = `${tempPath}.gz`;
    await compressFile(tempPath, compressedPath);

    console.log(`✓ ${tableName} backed up and compressed successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to backup ${tableName}:`, error);
    return false;
  }
}

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupsDir = path.join(process.cwd(), 'backups');
  const backupDir = path.join(backupsDir, timestamp);

  try {
    // Create backup directories
    fs.mkdirSync(backupsDir, { recursive: true });
    fs.mkdirSync(backupDir, { recursive: true });

    // Clean old backups first
    await cleanOldBackups(backupsDir);

    // Backup each table
    const tables = [
      {
        name: 'brands',
        query: () => prisma.brands.findMany()
      },
      {
        name: 'colors',
        query: () => prisma.colors.findMany()
      },
      {
        name: 'dress_styles',
        query: () => prisma.dress_styles.findMany()
      },
      {
        name: 'shoe_types',
        query: () => prisma.shoe_types.findMany()
      },
      {
        name: 'shoes',
        query: () => prisma.shoes.findMany({
          include: {
            color: true,
            dress_style: true,
            shoe_type: true,
            brand: true
          }
        })
      }
    ];

    // Process tables sequentially to avoid connection issues
    for (const table of tables) {
      const result = await backupTable(table.name, table.query, backupDir);
      if (!result) {
        throw new Error(`Failed to backup ${table.name}`);
      }
    }

    // Create a manifest file with backup info
    const manifest = {
      timestamp,
      tables: tables.map(t => t.name),
      compressed: true
    };
    fs.writeFileSync(
      path.join(backupDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log(`\nBackup completed successfully in: ${backupDir}`);

  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
