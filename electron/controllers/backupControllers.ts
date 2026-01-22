import { FetchLocalBackups, SaveLocalBackupFile } from '../services/backupServices';

import { IAppResponse } from '../@types/appResponse';
import { BackupMeta } from '../@types/backup';

import AppError from '../errors/AppError';

export async function GenerateBackup(): Promise<IAppResponse> {
  try {
    // Implementar os backups em nuvem
    await SaveLocalBackupFile();

    return {
      success: true,
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

export async function FetchBackups(): Promise<IAppResponse<BackupMeta[]>> {
  try {
    const local = await FetchLocalBackups();

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
