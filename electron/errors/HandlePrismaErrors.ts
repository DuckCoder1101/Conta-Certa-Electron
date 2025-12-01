import { Prisma } from '@prisma/client';
import AppError from './AppError';

type PrismaErrorHandler = (e: Prisma.PrismaClientKnownRequestError) => AppError;

const codes: Record<string, PrismaErrorHandler> = {
  P2002: () => {
    return new AppError(400, `Já existe um registro com essas informações!`);
  },
};

export default function HandlePrismaErrors(error: Prisma.PrismaClientKnownRequestError): AppError {
  const prismaError = codes[error.code](error);

  if (!prismaError) {
    return new AppError(500, `Erro do prisma, código ${error.code} não tratado!`);
  }

  return prismaError;
}
