import type { Billing as BaseBilling, ServiceBilling } from '@prisma/client';
import { ClientResumeDTO } from '@shared/DTOs';

export type { Client, Service, ServiceBilling, DocumentType } from '@prisma/client';
export interface Billing extends BaseBilling {
  client: ClientResumeDTO;
  totalFee: number;
  serviceBillings?: ServiceBilling[];
}