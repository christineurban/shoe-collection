import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readAndTransformCsv = () => {
  try {
    // Read the CSV file
    const csvFilePath = path.join(__dirname, 'shoe-data.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

    // Parse CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as SheetRow[];

    // Write the data to a JSON file
    const outputPath = path.join(__dirname, '..', 'transformed-shoes.json');
    fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));

    console.log(`Successfully processed ${records.length} records`);
    console.log(`Output written to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing CSV:', error);
    process.exit(1);
  }
};

readAndTransformCsv();
