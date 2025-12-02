import { parse } from 'csv-parse';
import { readFileSync } from 'fs';

export async function ImportCSV(filePath: string) {
  const content = readFileSync(filePath, { encoding: 'utf8' });

  parse(content, {
    skip_empty_lines: true,
    trim: false,
  });
}
