export interface IClientFormDTO {
  cpf: string | null;
  cnpj: string | null;
  name: string;
  email: string | null;
  phone: string;
  fee: number;
  feeDueDay: number;
}

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

export interface IClientResumeDTO {
  id: number;
  name: string;
}

export interface IAppError {
  code: string;
  status: number;
  params?: Record<string, string>;
}

export interface IAppResponseDTO<T = undefined> {
  success: boolean;
  data?: T;
  error?: IAppError;
}

export interface IService {
  id: number;
  name: string;
  value: number;
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
  id: number | null;
  name: string;
  value: number;
  quantity: number;

  serviceOriginId: number | null;
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

export interface IBillingResumeDTO {
  status: BillingStatus;
  fee: number;
  totalFee: number;
  dueDate: string;
  paidAt: string | null;
}

export interface IBillingFormDTO {
  id: number | null;
  fee: number;
  status: BillingStatus;
  dueDate: string;
  paidAt: string | null;

  clientId: number | null;
  serviceBillings: IServiceBillingFormDTO[];
}
