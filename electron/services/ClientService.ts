import { Client, PrismaClient } from '@prisma/client';

import { ClientResumeDTO, IClientCadDTO } from '@app/shared-types';

const prisma = new PrismaClient();

export async function FetchClientsService(offset: number, limit: number, filter: string) {
  return prisma.client.findMany({
    where: {
      OR: [{ name: { startsWith: filter } }, { document: { startsWith: filter } }],
    },
    orderBy: { id: 'asc' },
    skip: offset,
    take: limit,
  });
}

export async function FetchClientsResumeService() {
  return (await prisma.client.findMany({
    select: {
      id: true,
      name: true,
    },
  })) as ClientResumeDTO[];
}

export async function FetchClientByIdService(clientId: number) {
  return prisma.client.findUnique({
    where: {
      id: clientId,
    },
  });
}

export async function CountClientsService() {
  return prisma.client.count();
}

export async function CreateClientService(client: IClientCadDTO) {
  await prisma.client.create({
    data: {
      name: client.name,
      document: client.document,
      documentType: client.documentType,
      phone: client.phone,
      email: client.email,
      fee: client.fee,
      feeDueDay: client.feeDueDay,
    },
  });
}

export async function EditClientService(client: Client) {
  await prisma.client.update({
    where: {
      id: client.id,
    },
    data: {
      name: client.name,
      email: client.email,
      phone: client.phone,
      fee: client.fee,
      feeDueDay: client.feeDueDay,
    },
  });
}

export default async function DeleteClientService(clientId: number) {
  await prisma.client.delete({
    where: {
      id: clientId,
    },
  });
}
