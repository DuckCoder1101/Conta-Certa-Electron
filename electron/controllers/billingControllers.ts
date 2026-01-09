import { Prisma } from '@prisma/client';
import { IpcMainInvokeEvent } from 'electron';

import {
  CreateBillingService,
  DeleteBillingService,
  EditBillingService,
  FetchBillingsResumeService,
  FetchBillingsWithTotalService,
} from '../services/billingServices';

import { IAppResponseDTO, IBillingCadDTO, IBillingResumeDTO, IBillingWithTotalDTO } from '../@types/dtos';

import AppError from '../errors/AppError';
import HandlePrismaErrors from '../errors/HandlePrismaErrors';

export async function FetchBillingsController(
  _event: IpcMainInvokeEvent,
  offset = 0,
  limit = 30,
  filter = '',
): Promise<IAppResponseDTO<IBillingWithTotalDTO[]>> {
  try {
    console.log('Fetching billings...');
    const billings = await FetchBillingsWithTotalService(offset, limit, filter);

    return {
      success: true,
      data: billings,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}

export async function FetchBillingsResumeController(): Promise<IAppResponseDTO<IBillingResumeDTO[]>> {
  try {
    console.log('Fetching billings resumed...');
    const billings = await FetchBillingsResumeService();

    return {
      success: true,
      data: billings,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}

export async function SaveBillingController(_event: IpcMainInvokeEvent, billing: IBillingCadDTO): Promise<IAppResponseDTO> {
  try {
    console.log('Saving billing: ' + billing.id);

    // Validações
    if (!billing.clientId || billing.clientId <= 0) {
      throw new AppError('BILLING.INVALID_CLIENT', 400);
    }

    if (!billing.fee || billing.fee <= 0) {
      throw new AppError('BILLING.INVALID_FEE', 400);
    }

    if (!billing.dueDate) {
      throw new AppError('BILLING.INVALID_DUE_DATE', 400);
    }

    if (!billing.status) {
      throw new AppError('BILLING.INVALID_STATUS', 400);
    }

    if (billing.status === 'paid' && !billing.paidAt) {
      throw new AppError('BILLING.INVALID_PAID_AT', 400);
    }

    if (!billing.id) {
      await CreateBillingService(billing);
    } else {
      await EditBillingService(billing);
    }

    return {
      success: true,
    };
  } catch (err) {
    if (err instanceof AppError) {
      return {
        success: false,
        error: err,
      };
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = HandlePrismaErrors(err);

      return {
        success: false,
        error: prismaError,
      };
    }

    console.error(err);
    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}

export async function DeleteBillingController(_event: IpcMainInvokeEvent, billingId: number): Promise<IAppResponseDTO> {
  try {
    console.log('Deleting billing: ' + billingId);
    await DeleteBillingService(billingId);

    return {
      success: true,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}
