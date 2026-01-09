import { GetSettingsService, SetSettingsService } from '../services/settingsServices';

import { IAppResponseDTO } from '../@types/dtos';
import ISettings from '../@types/settings';

import AppError from '../errors/AppError';
import { IpcMainInvokeEvent } from 'electron';

export async function SetSettingsController(_event: IpcMainInvokeEvent, settings: ISettings): Promise<IAppResponseDTO> {
  try {
    console.log('Saving settings...');

    if (!settings) {
      return {
        success: false,
        error: new AppError('SETTINGS.INVALID_SETTINGS', 400),
      };
    }

    await SetSettingsService(settings);

    return {
      success: true,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}

export async function GetSettingsController(): Promise<IAppResponseDTO<ISettings>> {
  try {
    console.log('Getting settings...');
    const settings = await GetSettingsService();

    return {
      success: true,
      data: settings,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}
