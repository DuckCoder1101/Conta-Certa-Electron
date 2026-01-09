import { ipcMain } from 'electron';

import {
  CountClientsController,
  DeleteClientController,
  FetchClientByIdController,
  FetchClientsController,
  FetchClientsResumeController,
  SaveClientController,
} from './controllers/clientControllers';

import { ImportClientsCSVController } from './controllers/csvControllers';

import {
  DeleteBillingController,
  FetchBillingsController,
  FetchBillingsResumeController,
  SaveBillingController,
} from './controllers/billingControllers';

import { DeleteServiceController, FetchServicesController, SaveServiceController } from './controllers/serviceControllers';
import { GetSettingsController, SetSettingsController } from './controllers/settingsControllers';
import { FetchBackups, GenerateBackup } from './controllers/backupControllers';

export default async function HandleIPCEvents() {
  // --- CLIENTES ---
  ipcMain.handle('fetch-clients', FetchClientsController);
  ipcMain.handle('count-clients', CountClientsController);
  ipcMain.handle('save-client', SaveClientController);
  ipcMain.handle('delete-client', DeleteClientController);
  ipcMain.handle('fetch-clients-resume', FetchClientsResumeController);
  ipcMain.handle('fetch-client-by-id', FetchClientByIdController);

  // --- CSV ---
  ipcMain.on('import-clients-csv', ImportClientsCSVController);

  // --- FATURAMENTOS ---
  ipcMain.handle('fetch-billings', FetchBillingsController);
  ipcMain.handle('fetch-billings-resume', FetchBillingsResumeController);
  ipcMain.handle('save-billing', SaveBillingController);
  ipcMain.handle('delete-billing', DeleteBillingController);

  // --- SERVIÇOS ---
  ipcMain.handle('fetch-services', FetchServicesController);
  ipcMain.handle('save-service', SaveServiceController);
  ipcMain.handle('delete-service', DeleteServiceController);

  // --- CONFIGURAÇÕES ---
  ipcMain.handle('get-settings', GetSettingsController);
  ipcMain.handle('set-settings', SetSettingsController);

  // --- BACKUPS ---
  ipcMain.handle('generate-backup', GenerateBackup);
  ipcMain.handle('fetch-backups', FetchBackups);
}
