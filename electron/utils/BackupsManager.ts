import { createHash } from 'crypto';

import { IBackup } from '@app/shared-types';

import AppError from '../errors/AppError';

// Cria o hash do JSON
const sha256 = (data: string | Buffer): string => {
  return createHash('sha256').update(data).digest('hex');
};

// Gera os dados usados nos backups
export async function StringifyData(backup: IBackup): Promise<string> {
  const temp = structuredClone(backup);
  temp.meta.hash = '';
  temp.meta.size = 0;

  const json = JSON.stringify(temp, null, 2);

  backup.meta.hash = sha256(json);
  backup.meta.size = Buffer.byteLength(json);

  return JSON.stringify(backup, null, 2);
}

// Transforma os dados crus no objeto de backup
export async function ParseJSON(json: string): Promise<IBackup> {
  const backup: IBackup = JSON.parse(json);

  if (!backup.meta.hash) {
    throw new AppError('BACKUP.INVALID_OR_CORRUPTED_BACKUP', 500);
  }

  const temp = structuredClone(backup);

  const originalHash = temp.meta.hash;
  temp.meta.hash = '';
  temp.meta.size = 0;

  const baseJSON = JSON.stringify(temp, null, 2);
  const checkHash = sha256(baseJSON);

  if (originalHash !== checkHash) {
    throw new AppError('BACKUP.INVALID_OR_CORRUPTED_BACKUP', 500);
  }

  return backup;
}
