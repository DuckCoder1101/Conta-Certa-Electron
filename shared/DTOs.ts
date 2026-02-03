import type { Billing, Client, Service, ServiceBilling } from './Types';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type FormAction = 'create' | 'update';

// --- CLIENTE ---

export type ClientFormDTO = Optional<Client, 'id'> & {
  action: FormAction;
};

export type ClientResumeDTO = Pick<Client, 'id' | 'name'>;

export type ClientTableDTO = Client & {
  document: string;
  documentType: string;
  fee: string;
};

// --- SERVIÇO DE FATURAMENTO ---

export type ServiceBillingFormDTO = Optional<ServiceBilling, 'id'> & {
  action: FormAction;
};

export type ServiceFormDTO = Optional<Service, 'id'> & {
  action: FormAction;
};

// --- SERVIÇO ---

export type ServiceTableDTO = Service & {
  value: string;
};

// --- FATURAMENTO ---

export type BillingFormDTO = Optional<Omit<Billing, 'totalFee'>, 'id'> & {
  action: FormAction;
};

export type BillingTableDTO = Billing & {
  client: string;
  totalFee: string;
};

export type BillingResumeDTO = Pick<Billing, 'status' | 'fee' | 'totalFee' | 'dueDate' | 'paidAt'>;
