import { GetSettingsService, SetSettingsService } from '../services/SettingsService';

import { IAppResponse } from '@app/shared-types';
import ISettings from '../../packages/shared-types/src/interfaces/Settings';

import AppError from '../errors/AppError';
import { IpcMainInvokeEvent } from 'electron';

export async function SetSettingsController(_event: IpcMainInvokeEvent, settings: ISettings): Promise<IAppResponse> {
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

export async function GetSettingsController(): Promise<IAppResponse<ISettings>> {
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
