import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';

import IConfiguration from '../@types/configuration';
import { IAppResponseDTO } from '../@types/dtos';

import HandleFsErros from '../errors/HandleFsErrors';
import AppError from '../errors/AppError';

const APP_NAME = app.getName();
const CONFIG_PATH = join(app.getPath('appData'), `/${APP_NAME}/configuration.dat`);

const defaultConfig: IConfiguration = {
  autoBilling: true,
  autoUpdate: true,
  language: 'pt-BR',
  theme: 'dark',
};

export async function SaveConfiguration(options: IConfiguration): Promise<IAppResponseDTO<null>> {
  try {
    const json = JSON.stringify(options);
    writeFileSync(CONFIG_PATH, json, {
      encoding: 'utf-8',
    });

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    const message = HandleFsErros(error as NodeJS.ErrnoException);
    const appError = new AppError(500, message ?? 'Erro desconhecido!');

    return {
      success: false,
      data: null,
      error: appError,
    };
  }
}

export async function GetConfiguration(): Promise<IAppResponseDTO<IConfiguration>> {
  try {
    if (!existsSync(CONFIG_PATH)) {
      const { success, error } = await SaveConfiguration(defaultConfig);

      if (!success) {
        throw error;
      }
    }

    const json = readFileSync(CONFIG_PATH, {
      encoding: 'utf8',
    });

    const config = (await JSON.parse(json)) as IConfiguration;

    return {
      success: true,
      data: config,
      error: null,
    };
  } catch (error) {
    const message = HandleFsErros(error as NodeJS.ErrnoException);
    const appError = new AppError(500, message ?? 'Erro desconhecido!');

    return {
      success: false,
      data: null,
      error: appError,
    };
  }
}
