import { Billing } from "@prisma/client";

export interface IClientCadDTO {
  id: number | null;
  cpf: string | null;
  cnpj: string | null;
  name: string;
  email: string | null;
  phone: string;
  fee: number;
  feeDueDay: number;
}

export interface IServiceBillingCadDTO {
  id: number | null;
  serviceOriginId: number;
  name: string;
  value: number;
  quantity: number;
}

export type BillingStatus = "pending" | "paid";
export interface IBillingCadDTO {
  id: number | null;
  clientId: number;
  fee: number;
  status: BillingStatus;
  dueDate: string;
  paidAt: string | null;

  serviceBillings: IServiceBillingCadDTO[];
}

export interface IBillingResumeDTO {
  status: BillingStatus;
  fee: number;
  totalFee: number;
  dueDate: string;
  paidAt: string | null;
}

export interface IBillingWithTotalDTO extends Billing {
  totalFee: number;
}

export interface ICLientResumoDTO {
  id: number;
  name: string;
}

export interface IAppError {
  status: number;
  message: string;
}

export interface IAppResponseDTO<T> {
  success: boolean;
  data: T | null;
  error: IAppError | null;
}