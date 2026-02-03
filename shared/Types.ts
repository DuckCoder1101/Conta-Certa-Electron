import type { Billing as BaseBilling } from '@prisma/client';
import { ClientResumeDTO } from '@shared/DTOs';

export type { Client, Service, ServiceBilling, DocumentType } from '@prisma/client';
export type Billing = BaseBilling & {
  client: ClientResumeDTO;
  totalFee: number;
};
