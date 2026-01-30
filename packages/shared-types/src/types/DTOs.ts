import { IClient } from '../interfaces/Client';
import { IServiceBilling } from '../interfaces/ServiceBilling';
import { IBilling } from '../interfaces/Billing';
import { IService } from '../interfaces/Service';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type FormAction = 'create' | 'update';

export type IClientCadDTO = Optional<IClient, 'id'> & {
  action: FormAction;
};

export type ServiceBillingCadDTO = Optional<IServiceBilling, 'id'> & {
  action: FormAction;
};

export type ServiceCadDTO = Optional<IService, 'id'> & {
  action: FormAction;
};

export type BillingCadDTO = Optional<Omit<IBilling, 'totalFee'>, 'id'> & {
  action: FormAction;
};

export type BillingWithTotalFee = IBilling & {
  totalFee: number;
};

export type BillingResumeDTO = Pick<BillingWithTotalFee, 'status' | 'fee' | 'totalFee' | 'dueDate' | 'paidAt'>;
export type ClientResumeDTO = Pick<IClient, 'id' | 'name'>;
