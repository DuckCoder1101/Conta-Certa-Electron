import { BillingStatus } from '@t/Schemas';

export interface IClientFormDTO {
  cpf: string | null;
  cnpj: string | null;
  name: string;
  email: string | null;
  phone: string;
  fee: number;
  feeDueDay: number;
}

export interface IClientTableDTO {
  id: number;
  name: string;
  cpf: string;
  cnpj: string;
  email: string;
  phone: string;
  fee: string;
  feeDueDay: string;
}

export interface IClientResumeDTO {
  id: number;
  name: string;
}

export interface IServiceTableDTO {
  id: number;
  name: string;
  value: string;
}

export interface IServiceFormDTO {
  id: number;
  name: string;
  value: number;
}

export interface IServiceBilling {
  id: number;
  name: string;
  value: number;
  quantity: number;

  serviceOriginId: number | null;
  billingId: number;
}

export interface IServiceBillingFormDTO {
  id?: number;
  name: string;
  value: number;
  quantity: number;

  serviceOriginId: number | null;
}

export interface IBillingResumeDTO {
  status: BillingStatus;
  fee: number;
  totalFee: number;
  dueDate: string;
  paidAt: string | null;
}

export interface IBillingFormDTO {
  id?: number;
  fee: number;
  status: BillingStatus;
  dueDate: string;
  paidAt: string | null;

  clientId: number | null;
  serviceBillings: IServiceBillingFormDTO[];
}

export interface IBillingTableDTO {
  id: number;
  totalFee: string;
  status: string;
  dueDate: string;
  paidAt: string;
  client: string;
}

export interface IBackupMetaTableDTO {
  id: string;
  createdAt: string;
  size: string;
  source: string;
}
