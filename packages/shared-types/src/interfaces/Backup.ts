import { IClient } from './Client';
import { IBilling } from './Billing';
import { IService } from './Service';

export type BackupSource = 'local' | 'gdrive';

export interface BackupMeta {
  backupId: string;
  version: string;
  createdAt: string;
  size?: number;
  hash?: string;
  source: BackupSource;
}

export interface IBackup {
  meta: BackupMeta;
  data: {
    clients: IClient[];
    billings: IBilling[];
    services: IService[];
  };
}
