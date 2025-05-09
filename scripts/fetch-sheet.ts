import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface SheetRow {
  Image: string;
  Brand: string;
  Name: string;
  Color: string;
  DressStyle: string;
  ShoeType: string;
  Link: string;
  Notes: string;
}

const SPREADSHEET_ID = '1ca-HNVSJ-wN_GqXofcMzftFPTaMfKQ-zPJRFkAbQjRU';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // Fetch the sheet as CSV
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csv = await response.text();

    // Parse CSV
    const rows = csv.split('\n').map((row: string) =>
      row.split(',').map((cell: string) =>
        // Remove quotes and trim
        cell.replace(/^"(.*)"$/, '$1').trim()
      )
    );

    // Transform headers to match our expected format
    const headers = rows[0];
    const data = rows.slice(1).map((row: string[]): SheetRow => {
      const obj: Partial<SheetRow> = {};
      headers.forEach((header: string, i: number) => {
        // Map sheet headers to our expected format
        const mappedHeader = {
          'Image': 'Image',
          'Brand': 'Brand',
          'Name': 'Name',
          'Color': 'Color',
          'Dress Style': 'DressStyle',
          'Shoe Type': 'ShoeType',
          'Link': 'Link',
          'Notes': 'Notes',
        }[header] || header;

        (obj as any)[mappedHeader] = row[i] || '';
      });
      return obj as SheetRow;
    });

    // Write the data to a JSON file
    const outputPath = path.join(__dirname, '..', 'transformed-shoes.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`Successfully processed ${data.length} records`);
    console.log(`Output written to: ${outputPath}`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
