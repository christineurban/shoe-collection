import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import fetch from 'node-fetch';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
if (!supabaseServiceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
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

async function downloadImage(url: string, outputPath: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);

  const fileStream = fs.createWriteStream(outputPath);
  await pipeline(response.body!, fileStream);
}

async function backupImages() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupsDir = path.join(process.cwd(), 'image-backups');
  const backupDir = path.join(backupsDir, timestamp);

  try {
    // Create backup directories
    fs.mkdirSync(backupsDir, { recursive: true });
    fs.mkdirSync(backupDir, { recursive: true });

    // Clean old backups first
    await cleanOldBackups(backupsDir);

    // List all files in the bucket
    const { data: files, error } = await supabase.storage
      .from('shoe-images')
      .list('', {
        limit: 10000,
        offset: 0
      });

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    if (!files || files.length === 0) {
      console.log('No images found in storage');
      return;
    }

    console.log(`Found ${files.length} images to backup`);

    // Create a manifest file
    const manifest = {
      timestamp,
      totalFiles: files.length,
      bucket: 'shoe-images',
      files: files.map(f => ({
        name: f.name,
        size: f.metadata?.size,
        created: f.created_at,
        lastModified: f.updated_at
      }))
    };

    fs.writeFileSync(
      path.join(backupDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    // Download each file
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ file: string, error: string }> = [];

    for (const file of files) {
      try {
        const { data } = supabase.storage
          .from('shoe-images')
          .getPublicUrl(file.name);

        const outputPath = path.join(backupDir, file.name);

        // Ensure the directory exists for the file
        const dir = path.dirname(outputPath);
        fs.mkdirSync(dir, { recursive: true });

        await downloadImage(data.publicUrl, outputPath);
        successCount++;
        console.log(`✓ Backed up: ${file.name}`);
      } catch (error) {
        errorCount++;
        errors.push({
          file: file.name,
          error: error instanceof Error ? error.message : String(error)
        });
        console.error(`✗ Failed to backup ${file.name}:`, error);
      }
    }

    // Write backup summary
    const summary = {
      timestamp,
      totalFiles: files.length,
      successCount,
      errorCount,
      errors
    };

    fs.writeFileSync(
      path.join(backupDir, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\nBackup Summary:');
    console.log(`Total files: ${files.length}`);
    console.log(`Successfully backed up: ${successCount}`);
    console.log(`Failed: ${errorCount}`);
    console.log(`\nBackup completed in: ${backupDir}`);

  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

backupImages()
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
