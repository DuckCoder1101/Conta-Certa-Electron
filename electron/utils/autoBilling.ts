import { Prisma, PrismaClient } from '@prisma/client';
import makeYearMonth from './yearMonth';
import { IAppResponseDTO } from '../@types/dtos';
import HandlePrismaErrors from '../errors/HandlePrismaErrors';
import AppError from '../errors/AppError';

const prisma = new PrismaClient();

export default async function RunAutoBilling(): Promise<IAppResponseDTO<number>> {
  const now = new Date();
  const yearMonth = makeYearMonth(now);

  const clients = await prisma.client.findMany({
    select: {
      id: true,
      fee: true,
      feeDueDay: true,
    },
  });

  let i = 0;
  for (const client of clients) {
    const dueDate = `${now.getFullYear()}-${now.getMonth()}-${client.feeDueDay}`;

    try {
      await prisma.billing.create({
        data: {
          clientId: client.id,
          fee: client.fee,
          dueDate,
          yearMonth,
          status: 'pending',
          paidAt: null,
        },
      });

      i++;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code != 'P2002') {
          return {
            success: false,
            data: i,
            error: HandlePrismaErrors(error),
          };
        }
      } else {
        return {
          success: false,
          data: i,
          error: new AppError(500, 'Erro desconhecido!'),
        };
      }
    }
  }

  return {
    success: true,
    data: i,
    error: null,
  };
}
