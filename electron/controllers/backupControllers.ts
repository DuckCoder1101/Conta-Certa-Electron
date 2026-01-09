import { IAppResponseDTO } from '../@types/dtos';

import { FetchLocalBackups, SaveLocalBackupFile } from '../services/backupServices';
import AppError from '../errors/AppError';
import { BackupMeta } from '../@types/backup';

export async function GenerateBackup(): Promise<IAppResponseDTO> {
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

export async function FetchBackups(): Promise<IAppResponseDTO<BackupMeta[]>> {
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
