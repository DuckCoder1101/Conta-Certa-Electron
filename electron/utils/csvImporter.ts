import { readFileSync } from 'fs';
import { parse } from 'csv-parse';
import { BrowserWindow } from 'electron';

export async function ImportCSV(filePath: string) {
  const content = readFileSync(filePath, { encoding: 'utf8' });

  parse(
    content,
    {
      skip_empty_lines: true,
      trim: false,
    },
    (error) => {
      const mainWindow = BrowserWindow.getAllWindows()[0];
      mainWindow.webContents.send('import-csv-end', error);
    },
  );
}
