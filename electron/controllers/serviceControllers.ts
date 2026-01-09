import { IpcMainInvokeEvent } from 'electron';
import { Prisma, Service } from '@prisma/client';

import { IAppResponseDTO, IServiceCadDTO } from '../@types/dtos';

import AppError from '../errors/AppError';
import HandlePrismaErrors from '../errors/HandlePrismaErrors';

import { CreateServiceService, DeleteServiceService, EditServiceService, FetchServicesService } from '../services/serviceServices';

export async function FetchServicesController(_event: IpcMainInvokeEvent, offset = 0, limit = 30, filter = ''): Promise<IAppResponseDTO<Service[]>> {
  try {
    console.log('Fetching services...');
    const services = await FetchServicesService(offset, limit, filter);

    return {
      success: true,
      data: services,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}

export async function SaveServiceController(_event: IpcMainInvokeEvent, service: IServiceCadDTO): Promise<IAppResponseDTO> {
  try {
    console.log('Saving service: ' + service.name);

    service.name = service.name.trim();

    // Verifica o nome
    if (!service.name) {
      throw new AppError('SERVICE.INVALID_NAME', 400);
    }

    // Verifica o valor
    if (!service.value || typeof service.value != 'number') {
      throw new AppError('SERVICE.INVALID_VALUE', 400);
    }

    // Novo registro ou update?
    if (!service.id) {
      await CreateServiceService(service);
    } else {
      await EditServiceService(service as Service);
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
      error: {
        status: 500,
        message: 'Erro desconhecido ao salvar o serviço. Entre em contato com o suporte!',
      },
    };
  }
}

export async function DeleteServiceController(_event: IpcMainInvokeEvent, serviceId: number): Promise<IAppResponseDTO> {
  try {
    console.log('Deleting service: ' + serviceId);
    await DeleteServiceService(serviceId);

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
