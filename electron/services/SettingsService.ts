import { constants } from 'node:fs';
import { access, mkdir, readFile, writeFile } from 'fs/promises';

import { join } from 'path';
import { app } from 'electron';

import ISettings from '../../packages/shared-types/src/interfaces/Settings';

const APPDATA_PATH = join(app.getPath('appData'), app.getName());

const defaultConfig: ISettings = {
  autoBackup: true,
  autoBilling: true,
  autoUpdate: true,
  language: 'pt-BR',
  theme: 'dark',
};

export async function SetSettingsService(settings: ISettings) {
  console.log(settings);

  const json = JSON.stringify(settings);
  await writeFile(join(APPDATA_PATH, 'settings.json'), json, { encoding: 'utf8' });
}

export async function GetSettingsService(): Promise<ISettings> {
  await mkdir(APPDATA_PATH, { recursive: true }); // Garante que o arquivo de configurações exista

  const exists = await access(join(APPDATA_PATH, 'settings.json'), constants.F_OK)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    await SetSettingsService(defaultConfig);
    return defaultConfig;
  }

  const json = await readFile(join(APPDATA_PATH, 'settings.json'), { encoding: 'utf8' });

  return JSON.parse(json) as ISettings;
}
