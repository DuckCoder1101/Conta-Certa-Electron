import type { Billing, Client, Service, ServiceBilling } from './Types';

export type AllString<T> = {
  [K in keyof T]: string;
};

// --- CLIENTE ---

export type ClientFormDTO = {
  id?: string;
  name: string;
  document: string;
  documentType: DocumentType;
  phone: string;
  email?: string;
  fee: number;
  feeDueDay: number;
}

export type ClientResumeDTO = Pick<Client, 'id' | 'name'>;
export type ClientTableDTO = AllString<Client>;

// --- SERVIÇO DE FATURAMENTO ---

export interface ServiceBillingFormDTO {
  id?: string;
  serviceBaseId: number;
  billingId: number;
  quantity: number;
  value: number;
}

// --- SERVIÇO ---

export interface ServiceFormDTO {
  id?: string;
  name: string;
  value: number
}

export type ServiceTableDTO = AllString<Service>;

// --- FATURAMENTO ---

export interface BillingFormDTO {
  id?: string;
  clientId: number;
  fee: number;
  status: string;
  paidAt: string | null;
  dueDate: string;
  serviceBillings: ServiceBillingFormDTO[];
}

export type BillingTableDTO = AllString<Billing> & {
  client: ClientResumeDTO;
  serviceBillings: ServiceBilling[];
};

export type BillingResumeDTO = Pick<Billing, 'status' | 'fee' | 'totalFee' | 'dueDate' | 'paidAt'>;
