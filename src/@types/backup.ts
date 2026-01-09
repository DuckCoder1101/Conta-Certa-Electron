export type BackupSource = 'local' | 'gdrive';

export interface BackupMeta {
  id: string;
  version: string;
  createdAt: string;
  size?: number;
  hash?: string;
  source: BackupSource;
}
