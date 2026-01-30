import { app, shell } from 'electron';
import { mkdir, readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { ParseJSON } from '../utils/BackupsManager';

import { BackupMeta } from '@app/shared-types';

const BACKUPS_PATH = join(app.getPath('appData'), app.getName(), 'backups');

// Cria a pasta de backups caso ela não exista
const MkBackupFolder = async () => await mkdir(BACKUPS_PATH, { recursive: true });

// Carrega os backups locais
export async function FetchLocalBackupsService(): Promise<BackupMeta[]> {
  await MkBackupFolder();

  const metas: Array<BackupMeta> = [];
  const files = await readdir(BACKUPS_PATH);

  for (const name of files) {
    if (name.endsWith('.json')) {
      const data = await readFile(join(BACKUPS_PATH, `${name}`), { encoding: 'utf8' });
      const backup = await ParseJSON(data);

      metas.push(backup.meta);
    }
  }

  return metas;
}

// Abre a pasta local de backups
export async function OpenLocalBackupsFolderService() {
  await shell.openPath(BACKUPS_PATH);
}

// Abre a lista de backups do google drive
export async function OpenRemoteBackupsFolderService() {
  await shell.openExternal('');
}
