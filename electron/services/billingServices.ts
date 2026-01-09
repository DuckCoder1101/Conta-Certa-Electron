import { PrismaClient } from '@prisma/client';
import { BillingStatus, IBillingCadDTO, IBillingResumeDTO, IBillingWithTotalDTO } from '../@types/dtos';
import toYearMonth from '../utils/yearMonth';

const prisma = new PrismaClient();

export async function FetchBillingsWithTotalService(offset: number, limit: number, filter: string) {
  const billingsRaw = await prisma.billing.findMany({
    orderBy: { id: 'asc' },
    skip: offset,
    take: limit,
    where: {
      AND: [
        filter
          ? {
              OR: [{ client: { name: { startsWith: filter } } }, { status: filter === 'pendente' ? 'pending' : filter === 'pago' ? 'paid' : '' }],
            }
          : {},
      ],
    },
    include: {
      serviceBillings: true,
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const billings: IBillingWithTotalDTO[] = billingsRaw.map((b) => ({
    ...b,
    totalFee: b.fee + b.serviceBillings.reduce((acc, s) => acc + s.value * s.quantity, 0),
  }));

  return billings;
}

export async function FetchBillingsResumeService() {
  const billingsRaw = await prisma.billing.findMany({
    orderBy: { id: 'asc' },
    select: {
      fee: true,
      status: true,
      dueDate: true,
      paidAt: true,
      serviceBillings: {
        select: {
          value: true,
          quantity: true,
        },
      },
    },
  });

  const billings: IBillingResumeDTO[] = billingsRaw.map((b) => ({
    fee: b.fee,
    status: b.status as BillingStatus,
    dueDate: b.dueDate,
    paidAt: b.paidAt,
    totalFee: b.fee + b.serviceBillings.reduce((acc, s) => acc + s.value * s.quantity, 0),
  }));

  return billings;
}

export async function CreateBillingService(billing: IBillingCadDTO) {
  const created = await prisma.billing.create({
    data: {
      clientId: billing.clientId,
      fee: billing.fee,
      status: billing.status,
      dueDate: billing.dueDate,
      yearMonth: toYearMonth(billing.dueDate),
      paidAt: billing.status === 'paid' ? billing.paidAt : null,
    },
  });

  // -------- SALVAR SERVIÇOS DA COBRANÇA --------
  if (billing.serviceBillings && billing.serviceBillings.length > 0) {
    const servicesToCreate = billing.serviceBillings
      .filter((s) => s.quantity > 0)
      .map((s) => ({
        billingId: created.id!,
        serviceOriginId: s.serviceOriginId,
        name: s.name,
        value: s.value,
        quantity: s.quantity,
      }));

    if (servicesToCreate.length > 0) {
      await prisma.serviceBilling.createMany({
        data: servicesToCreate,
      });
    }
  }
}

export async function EditBillingService(billing: IBillingCadDTO) {
  await prisma.billing.update({
    where: { id: billing.id! },
    data: {
      clientId: billing.clientId,
      fee: billing.fee,
      status: billing.status,
      dueDate: billing.dueDate,
      yearMonth: toYearMonth(billing.dueDate),
      paidAt: billing.status === 'paid' ? billing.paidAt : null,
    },
  });

  // limpar serviços antigos antes de recriar
  await prisma.serviceBilling.deleteMany({
    where: { billingId: billing.id },
  });

  // -------- SALVAR SERVIÇOS DA COBRANÇA --------
  if (billing.serviceBillings && billing.serviceBillings.length > 0) {
    const servicesToCreate = billing.serviceBillings
      .filter((s) => s.quantity > 0)
      .map((s) => ({
        billingId: billing.id!,
        serviceOriginId: s.serviceOriginId,
        name: s.name,
        value: s.value,
        quantity: s.quantity,
      }));

    if (servicesToCreate.length > 0) {
      await prisma.serviceBilling.createMany({
        data: servicesToCreate,
      });
    }
  }
}

export async function DeleteBillingService(billingId: number) {
  await prisma.billing.delete({
    where: {
      id: billingId,
    },
  });
}
