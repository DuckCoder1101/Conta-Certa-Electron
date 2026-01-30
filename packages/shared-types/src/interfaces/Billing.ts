import { IServiceBilling } from './ServiceBilling';

export type BillingStatus = 'pending' | 'paid';
export interface IBilling {
  id?: number;
  clientId: number;
  fee: number;
  status: BillingStatus;
  dueDate: string;
  paidAt: string | null;

  serviceBillings: IServiceBilling[];
}
