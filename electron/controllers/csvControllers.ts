import { BrowserWindow, dialog } from 'electron';
import { IAppResponse } from '../@types/appResponse';

import AppError from '../errors/AppError';
import { ImportClientsCSVService } from '../services/csvServices';

export async function ImportClientsCSVController(): Promise<IAppResponse> {
  try {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Importar clientes',
      message: 'Selecione o arquivo CSV contendo os dados dos clientes.',
      properties: ['openFile'],
      filters: [
        {
          name: 'CSV',
          extensions: ['csv'],
        },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) {
      throw new AppError('CSV.IMPORT_CANCELLED', 400);
    }

    await ImportClientsCSVService(result.filePaths[0]);

    return {
      success: true,
    };
  } catch (err) {
    if (err instanceof AppError) {
      return {
        success: false,
        error: err,
      };
    }

    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}
