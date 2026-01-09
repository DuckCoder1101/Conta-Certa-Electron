import { Billing, Client, Service } from '@prisma/client';

export type BackupSource = 'local' | 'gdrive';

export interface BackupMeta {
  backupId: string;
  version: string;
  createdAt: string;
  size?: number;
  hash?: string;
  source: BackupSource;
}

export interface Backup {
  meta: BackupMeta;
  data: {
    clients: Client[];
    billings: Billing[];
    services: Service[];
  };
}
