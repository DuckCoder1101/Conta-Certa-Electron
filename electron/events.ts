import { BrowserWindow, dialog, ipcMain } from 'electron';
import { Client, PrismaClient, Service } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { BillingStatus, IAppResponseDTO, IBillingCadDTO, IBillingResumeDTO, IBillingWithTotalDTO, IClientCadDTO, ICLientResumoDTO } from './@types/dtos';

import AppError from './errors/AppError';
import HandlePrismaErrors from './errors/HandlePrismaErrors';
import { ImportCSV } from './csvImporter';

const prisma = new PrismaClient();

export default async function HandleIPCEvents() {
  // --- CLIENTES ---

  ipcMain.handle('fetch-clients', async (_event, offset = 0, limit = 30, filter = ''): Promise<IAppResponseDTO<Client[]>> => {
    console.log('Fetching clients.');

    try {
      const clients = await prisma.client.findMany({
        where: {
          OR: [{ name: { startsWith: filter } }, { cpf: { startsWith: filter } }, { cnpj: { startsWith: filter } }],
        },
        orderBy: { id: 'asc' },
        skip: offset,
        take: limit,
      });

      return {
        success: true,
        data: clients,
        error: null,
      };
    } catch (error) {
      console.error('Error fetching clients:', error);

      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao carregar os clientes. Entre em contato com o suporte!',
        },
      };
    }
  });

  ipcMain.handle('count-clients', async (): Promise<IAppResponseDTO<number>> => {
    console.log('Counting clients.');

    try {
      const count = await prisma.client.count();
      return {
        success: true,
        data: count,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao salvar cliente. Entre em contato com o suporte!',
        },
      };
    }
  });

  ipcMain.handle('save-client', async (_event, data: IClientCadDTO): Promise<IAppResponseDTO<null>> => {
    console.log('Saving client:', data.name);

    try {
      // Verifica o telefone
      if (data.phone.length != 11) {
        throw new AppError(400, 'Número de telefone inválido!');
      }

      // Novo registro ou update?
      if (!data.id) {
        // Verifica se existe CPF ou CNPJ
        if (!data.cpf && !data.cnpj) {
          throw new AppError(400, 'O Cliente deve possuir ao menos um CPF ou CNPJ válidos!');
        }

        // Verifica o CPF
        if (data.cpf && data.cpf.length != 11) {
          throw new AppError(400, 'CPF inválido!');
        }

        // Verifica o CNPJ
        if (data.cnpj && data.cnpj.length != 14) {
          throw new AppError(400, 'CNPJ inválido!');
        }

        await prisma.client.create({
          data: {
            name: data.name,
            cpf: data.cpf,
            cnpj: data.cnpj,
            phone: data.phone,
            email: data.email,
            fee: data.fee,
            feeDueDay: data.feeDueDay,
          },
        });
      } else {
        await prisma.client.update({
          where: {
            id: data.id,
          },
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            fee: data.fee,
            feeDueDay: data.feeDueDay,
          },
        });
      }

      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          data: null,
          error,
        };
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = HandlePrismaErrors(error);

        return {
          success: false,
          data: null,
          error: prismaError,
        };
      }

      console.log(error);
      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao salvar cliente. Entre em contato com o suporte!',
        },
      };
    }
  });

  ipcMain.handle('delete-client', async (_event, clientId: number): Promise<IAppResponseDTO<null>> => {
    console.log('Deleting client: ' + clientId);

    try {
      await prisma.client.delete({
        where: {
          id: clientId,
        },
      });

      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao carregar os clientes. Entre em contato com o suporte!',
        },
      };
    }
  });

  ipcMain.handle('fetch-clients-resume', async (): Promise<IAppResponseDTO<ICLientResumoDTO[]>> => {
    console.log('Fetching clients resume.');

    try {
      const clientsResume = (await prisma.client.findMany({
        select: {
          id: true,
          name: true,
        },
      })) as ICLientResumoDTO[];

      return {
        success: true,
        error: null,
        data: clientsResume,
      };
    } catch (error) {
      console.error('Error fetching clients resume:', error);

      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao carregar os clientes. Entre em contato com o suporte!',
        },
      };
    }
  });

  ipcMain.handle('fetch-client-by-id', async (_event, clientId: number): Promise<IAppResponseDTO<Client>> => {
    console.log('Fetching client by id: ' + clientId);

    try {
      if (!clientId) {
        throw new AppError(400, 'ID de cliente inválido!');
      }

      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
        },
      });

      if (!client) {
        throw new AppError(404, 'Cliente não encontrado');
      }

      return {
        success: true,
        error: null,
        data: client,
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error: error,
          data: null,
        };
      }

      console.error('Error fetching clients resume:', error);
      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao carregar os clientes. Entre em contato com o suporte!',
        },
      };
    }
  });

  ipcMain.on('import-clients-csv', async () => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Importar clientes',
      message: 'Selecione o arquivo CSV contendo os dados dos clientes.',
      properties: ['openFile'],
      filters: [
        {
          name: 'CSV',
          extensions: ['csv'],
        },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return {
        data: null,
        success: false,
        error: null,
      };
    }

    ImportCSV(result.filePaths[0]);
  });

  // --- FATURAMENTOS ---
  ipcMain.handle('fetch-all-billings', async (_event, offset = 0, limit = 30, filter = ''): Promise<IAppResponseDTO<IBillingWithTotalDTO[]>> => {
    console.log('Fetching billings.');

    try {
      const billingsRaw = await prisma.billing.findMany({
        orderBy: { id: 'asc' },
        skip: offset,
        take: limit,
        where: {
          AND: [
            filter
              ? {
                  OR: [{ client: { name: { startsWith: filter } } }, { status: filter }],
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

      return {
        success: true,
        data: billings,
        error: null,
      };
    } catch (error) {
      console.error('Error fetching billings:', error);

      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao carregar os faturamentos. Entre em contato com o suporte!',
        },
      };
    }
  });

  ipcMain.handle('fetch-all-billings-resume', async (): Promise<IAppResponseDTO<IBillingResumeDTO[]>> => {
    console.log('Fetching billings resume.');

    try {
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

      const resumes: IBillingResumeDTO[] = billingsRaw.map((b) => ({
        fee: b.fee,
        status: b.status as BillingStatus,
        dueDate: b.dueDate,
        paidAt: b.paidAt,
        totalFee: b.fee + b.serviceBillings.reduce((acc, s) => acc + s.value * s.quantity, 0),
      }));

      return {
        success: true,
        data: resumes,
        error: null,
      };
    } catch (error) {
      console.error('Error fetching billings:', error);

      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao carregar os faturamentos. Entre em contato com o suporte!',
        },
      };
    }
  });

  ipcMain.handle('save-billing', async (_event, data: IBillingCadDTO): Promise<IAppResponseDTO<null>> => {
    console.log('Saving billing for: ' + data.clientId);

    try {
      // -------- VALIDAÇÕES --------

      if (!data.clientId || data.clientId <= 0) {
        throw new AppError(400, 'Cliente inválido!');
      }

      if (!data.fee || data.fee <= 0) {
        throw new AppError(400, 'Honorário inválido!');
      }

      if (!data.dueDate) {
        throw new AppError(400, 'Data de vencimento inválida!');
      }

      if (!data.status) {
        throw new AppError(400, 'Status inválido!');
      }

      if (data.status === 'paid' && !data.paidAt) {
        throw new AppError(400, 'Data de pagamento inválida!');
      }

      // -------- CREATE OU UPDATE --------
      let billingId = data.id ?? null;

      if (!billingId) {
        // CREATE
        const created = await prisma.billing.create({
          data: {
            clientId: data.clientId,
            fee: data.fee,
            status: data.status,
            dueDate: data.dueDate,
            paidAt: data.status === 'paid' ? data.paidAt : null,
          },
        });

        billingId = created.id;
      } else {
        // UPDATE
        await prisma.billing.update({
          where: { id: billingId },
          data: {
            clientId: data.clientId,
            fee: data.fee,
            status: data.status,
            dueDate: data.dueDate,
            paidAt: data.status === 'paid' ? data.paidAt : null,
          },
        });

        // limpar serviços antigos antes de recriar
        await prisma.serviceBilling.deleteMany({
          where: { billingId },
        });
      }

      // -------- SALVAR SERVIÇOS DA COBRANÇA --------
      if (data.serviceBillings && data.serviceBillings.length > 0) {
        const servicesToCreate = data.serviceBillings
          .filter((s) => s.quantity > 0)
          .map((s) => ({
            billingId: billingId!,
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

      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          data: null,
          error,
        };
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = HandlePrismaErrors(error);

        return {
          success: false,
          data: null,
          error: prismaError,
        };
      }

      console.error(error);

      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao salvar cobrança. Contate o suporte!',
        },
      };
    }
  });

  ipcMain.handle('delete-billing', async (_event, billingId: number): Promise<IAppResponseDTO<null>> => {
    console.log('Deleting billing: ' + billingId);

    try {
      await prisma.billing.delete({
        where: {
          id: billingId,
        },
      });

      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          data: null,
          error,
        };
      }

      console.error(error);

      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao salvar cobrança. Contate o suporte!',
        },
      };
    }
  });

  // --- SERVIÇOS ---
  ipcMain.handle('fetch-services', async (_event, offset = 0, limit = 30, filter = ''): Promise<IAppResponseDTO<Service[]>> => {
    console.log('Fetching services.');

    try {
      const services = await prisma.service.findMany({
        where: {
          name: {
            startsWith: filter,
          },
        },
        orderBy: { id: 'asc' },
        skip: offset,
        take: limit,
      });

      return {
        success: true,
        data: services,
        error: null,
      };
    } catch (error) {
      console.error('Error fetching services:', error);

      return {
        success: false,
        data: null,
        error: {
          status: 500,
          message: 'Erro desconhecido ao carregar os serviços. Entre em contato com o suporte!',
        },
      };
    }
  });
}
