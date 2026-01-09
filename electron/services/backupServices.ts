import { app, shell } from 'electron';
import { PrismaClient } from '@prisma/client';

import { gunzip, gzip } from 'zlib';
import { promisify } from 'util';
import { createHash } from 'crypto';

import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { Backup, BackupMeta, BackupSource } from '../@types/backup';

import AppError from '../errors/AppError';

const prisma = new PrismaClient();

// Transformar os mudulos gzip zlib em promise
const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

const BACKUPS_PATH = join(app.getPath('appData'), app.getName(), 'backups');

// Cria a pasta de backups caso ela não exista
const MkBackupFolder = async () => await mkdir(BACKUPS_PATH, { recursive: true });

// Cria o hash do JSON
const sha256 = (data: string | Buffer): string => {
  return createHash('sha256').update(data).digest('hex');
};

// Gera os dados usados nos backups
async function GenerateBackupData(source: BackupSource): Promise<Buffer> {
  const [clients, billings, services] = await prisma.$transaction([
    prisma.client.findMany(),
    prisma.billing.findMany({ include: { serviceBillings: true } }),
    prisma.service.findMany(),
  ]);

  const backup: Backup = {
    meta: {
      backupId: crypto.randomUUID(),
      version: '1.0',
      createdAt: new Date().toISOString(),
      source,
    },
    data: {
      clients,
      billings,
      services,
    },
  };

  let json = JSON.stringify(backup);

  backup.meta.size = Number((Buffer.byteLength(json, 'utf-8') / 1024 ** 2).toFixed(2));
  backup.meta.hash = sha256(json);

  json = JSON.stringify(backup);
  return await gzipAsync(json);
}

// Transforma os dados crus no objeto de backup
async function ParseRawBackupData(data: Buffer): Promise<Backup> {
  const buffer = await gunzipAsync(data);
  const json = buffer.toString('utf-8');

  const backup: Backup = JSON.parse(json);

  if (!backup.meta.hash || sha256(json) != backup.meta.hash) {
    throw new AppError('BACKUP.INVALID_OR_CORRUPTED_BACKUP', 500);
  }

  return backup;
}

// Salva um backup novo
export async function SaveLocalBackupFile() {
  await MkBackupFolder();

  const compressed = await GenerateBackupData('local');
  const backupDate = new Date().toISOString().split('T')[0];

  await writeFile(join(BACKUPS_PATH, `backup-${backupDate}.json.gz`), compressed);
}

// Carrega os backups locais
export async function FetchLocalBackups(): Promise<BackupMeta[]> {
  await MkBackupFolder();

  const metas: Array<BackupMeta> = [];
  const files = await readdir(BACKUPS_PATH);

  for (const name of files) {
    if (name.endsWith('.json.gz')) {
      const data = await readFile(join(BACKUPS_PATH, `${name}`));
      const backup = await ParseRawBackupData(data);

      metas.push(backup.meta);
    }
  }

  return metas;
}

// Abre a pasta local de backups
export async function OpenLocalBackupsFolder() {
  await shell.openPath(BACKUPS_PATH);
}

// Abre a lista de backups do google drive
export async function OpenRemoteBackupsFolder() {
  await shell.openExternal('');
}
