import { type IpcMainInvokeEvent } from 'electron';
import { Client, Prisma } from '@prisma/client';

import { ClientResumeDTO, IAppResponse, IClientCadDTO } from '@app/shared-types';

import DeleteClientService, {
  CountClientsService,
  CreateClientService,
  EditClientService,
  FetchClientByIdService,
  FetchClientsResumeService,
  FetchClientsService,
} from '../services/ClientService';

import AppError from '../errors/AppError';
import HandlePrismaErrors from '../errors/HandlePrismaErrors';

export async function FetchClientsController(
  _event: IpcMainInvokeEvent,
  offset = 0,
  limit = 30,
  filter = '',
): Promise<IAppResponse<Client[]>> {
  try {
    console.log('Fetching clients.');
    const clients = await FetchClientsService(offset, limit, filter);

    return {
      data: clients,
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

export async function FetchClientsResumeController(): Promise<IAppResponse<ClientResumeDTO[]>> {
  try {
    console.log('Fetching all clients resume...');
    const clients = await FetchClientsResumeService();

    return {
      success: true,
      data: clients,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}

export async function FetchClientByIdController(
  _event: IpcMainInvokeEvent,
  clientId: number,
): Promise<IAppResponse<Client>> {
  try {
    console.log('Fetching client: ' + clientId);
    const client = await FetchClientByIdService(clientId);

    if (!client) {
      throw new AppError('CLIENT.CLIENT_NOT_FOUND', 404);
    }

    return {
      success: true,
      data: client,
    };
  } catch (err) {
    if (err instanceof AppError) {
      return {
        success: false,
        error: err,
      };
    }

    console.error(err);
    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}

export async function CountClientsController(): Promise<IAppResponse<number>> {
  try {
    console.log('Counting clients.');
    const count = await CountClientsService();

    return {
      success: true,
      data: count,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: new AppError('UNEXPECTED_ERROR', 500),
    };
  }
}

export async function SaveClientController(_event: IpcMainInvokeEvent, client: IClientCadDTO): Promise<IAppResponse> {
  try {
    console.log('Saving client: ' + client.name);

    // Verifica o nome
    client.name = client.name.trim();
    if (!client.name) {
      throw new AppError('CLIENT.INVALID_NAME', 400);
    }

    // Verifica o telefone
    if (client.phone.length != 11) {
      throw new AppError('CLIENT.INVALID_PHONE', 400);
    }

    // Novo registro ou update?
    if (!client.id) {
      await CreateClientService(client);
    } else {
      await EditClientService(client as Client);
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

export async function DeleteClientController(_event: IpcMainInvokeEvent, clientId: number): Promise<IAppResponse> {
  try {
    console.log('Deleting client: ' + clientId);
    await DeleteClientService(clientId);

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
