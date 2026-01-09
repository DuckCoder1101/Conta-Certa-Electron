import { BrowserWindow } from 'electron';
import { parse } from 'csv-parse';

import { readFile } from 'fs/promises';

export async function ImportClientsCSVService(filePath: string) {
  const content = await readFile(filePath, { encoding: 'utf8' });

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
