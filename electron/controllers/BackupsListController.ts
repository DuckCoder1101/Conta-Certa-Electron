import { FetchLocalBackupsService } from '../services/BackupsListService';

import { BackupMeta, IAppResponse } from '@app/shared-types';

import AppError from '../errors/AppError';

export async function FetchBackupsController(): Promise<IAppResponse<BackupMeta[]>> {
  console.log('Fetching backups...');

  try {
    const local = await FetchLocalBackupsService();

    return {
      success: true,
      data: local,
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false,
        error: error,
      };
    }

    console.error(error);
    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}

// export async function OpenLocalBackupsFolderController(): Promise<IAppResponse> {}
//
// export async function OpenRemoteBackupsFolderController(): Promise<IAppResponse> {}
