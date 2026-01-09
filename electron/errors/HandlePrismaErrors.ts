import { Prisma } from '@prisma/client';
import AppError from './AppError';

type PrismaErrorHandler = (e: Prisma.PrismaClientKnownRequestError) => AppError;

const codes: Record<string, PrismaErrorHandler> = {
  P2002: () => {
    return new AppError('DB.ALREADY_EXISTS', 400);
  },
};

export default function HandlePrismaErrors(error: Prisma.PrismaClientKnownRequestError): AppError {
  const prismaError = codes[error.code](error);

  if (!prismaError) {
    return new AppError('DB.UNKNOWN_ERROR', 500);
  }

  return prismaError;
}
