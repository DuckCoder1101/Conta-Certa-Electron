import { ipcMain } from 'electron';

import {
  CountClientsController,
  DeleteClientController,
  FetchClientByIdController,
  FetchClientsController,
  FetchClientsResumeController,
  SaveClientController,
} from './controllers/ClientsController';

import {
  DeleteBillingController,
  FetchBillingsController,
  FetchBillingsResumeController,
  SaveBillingController,
} from './controllers/BillingsController';

import {
  DeleteServiceController,
  FetchServicesController,
  SaveServiceController,
} from './controllers/ServicesController';
import { GetSettingsController, SetSettingsController } from './controllers/SettingsController';
import { FetchBackupsController } from './controllers/BackupsListController';
import { StartTaskController } from './controllers/TasksController';

export default async function HandleIPCEvents() {
  // --- CLIENTES ---
  ipcMain.handle('fetch-clients', FetchClientsController);
  ipcMain.handle('count-clients', CountClientsController);
  ipcMain.handle('save-client', SaveClientController);
  ipcMain.handle('delete-client', DeleteClientController);
  ipcMain.handle('fetch-clients-resume', FetchClientsResumeController);
  ipcMain.handle('fetch-client-by-id', FetchClientByIdController);

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

  // --- LISTA DE BACKUPS ---
  ipcMain.handle('fetch-backups', FetchBackupsController);

  // TAREFAS DE SEGUNDO PLANO
  ipcMain.on('task:start', StartTaskController);
}
