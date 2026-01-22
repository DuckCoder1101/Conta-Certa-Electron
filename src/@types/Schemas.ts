import { IClientResumeDTO, IServiceBilling } from '@t/DTOs';

export interface IClient {
  id: number;
  cpf: string | null;
  cnpj: string | null;
  name: string;
  email: string | null;
  phone: string;
  fee: number;
  feeDueDay: number;
}

export interface IService {
  id: number;
  name: string;
  value: number;
}

export type BillingStatus = 'pending' | 'paid';
export interface IBilling {
  id: number;
  fee: number;
  totalFee: number;
  status: BillingStatus;
  dueDate: string;
  paidAt: string | null;

  client: IClientResumeDTO | null;
  serviceBillings: IServiceBilling[];
}

export type BackupSource = 'local' | 'gdrive';
export interface IBackupMeta {
  id: string;
  version: string;
  createdAt: string;
  size?: number;
  hash?: string;
  source: BackupSource;
}

export default interface ISettings {
  autoBilling: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  autoUpdate: boolean;
  autoBackup: boolean;
}
