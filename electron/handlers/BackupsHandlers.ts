import { app } from 'electron';
import { PrismaClient } from '@prisma/client';
import { mkdir } from 'fs/promises';
import { Readable, Writable } from 'node:stream';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { join } from 'path';

import { ParseJSON, StringifyData } from '../utils/BackupsManager';
import { ProgressStream } from '../utils/ProgressStream';

import { IBackup, ITaskContext } from '@app/shared-types';
import AppError from '../errors/AppError';
import { stat } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

const BACKUPS_PATH = join(app.getPath('appData'), app.getName(), 'backups');
const MkBackupFolder = async () => await mkdir(BACKUPS_PATH, { recursive: true });

const prisma = new PrismaClient();

export async function ExportLocalBackup(ctx: ITaskContext) {
  await MkBackupFolder();

  const [clients, billings, services] = await prisma.$transaction([
    prisma.client.findMany(),
    prisma.billing.findMany({ include: { serviceBillings: true } }),
    prisma.service.findMany(),
  ]);

  const backup: IBackup = {
    meta: {
      backupId: crypto.randomUUID(),
      version: '1.0',
      createdAt: new Date().toISOString(),
      source: 'local',
    },
    data: {
      clients,
      billings,
      services,
    },
  };

  const json = await StringifyData(backup);

  const backupDate = new Date().toISOString().split('T')[0];
  const filePath = join(BACKUPS_PATH, `backup-${backupDate.toString()}.json`);

  const totalSize = json.length;

  await pipeline(Readable.from(json), new ProgressStream(totalSize, ctx.progress), createWriteStream(filePath));
}

export async function ImportLocalBackup(ctx: ITaskContext) {
  await MkBackupFolder();

  if (!ctx.payload || typeof ctx.payload !== 'string') {
    throw new AppError('BACKUP.INVALID_FILE_PATH', 400);
  }

  const filePath = join(BACKUPS_PATH, ctx.payload);
  if (!existsSync(filePath)) {
    throw new AppError('BACKUP.INVALID_FILE_PATH', 400);
  }

  // Tamanho do arquivo
  const { size } = await stat(filePath);

  // Bytes do arquivo
  let read = 0;
  const chunks: Buffer[] = [];

  const collector = new Writable({
    write(chunk, _enc, cb) {
      read += chunk.length;

      const percent = ((read / size) * 30) / 100;
      ctx.progress(percent);

      chunks.push(chunk);
      cb();
    },
  });

  await pipeline(createReadStream(filePath), collector);

  // JSON
  const json = Buffer.concat(chunks).toString();

  // Objeto de backup
  const backup = await ParseJSON(json);

  // Importa o backup
  await prisma.$transaction(async (tx) => {
    ctx.progress(0.5);

    // Limpa o banco
    await tx.serviceBilling.deleteMany();
    await tx.service.deleteMany();
    await tx.billing.deleteMany();
    await tx.client.deleteMany();

    ctx.progress(0.65);

    // Importa os clientes
    await tx.client.createMany({
      data: backup.data.clients,
    });

    ctx.progress(0.8);

    // Importa os serviços
    await tx.service.createMany({
      data: backup.data.services,
    });

    ctx.progress(0.9);

    // Importa os faturamentos e serviços de faturamento
    await tx.billing.createMany({
      data: backup.data.billings,
    });

    ctx.progress(0.1);
  });
}
