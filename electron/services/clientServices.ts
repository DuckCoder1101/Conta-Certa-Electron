import { Client, PrismaClient } from '@prisma/client';

import { IClientCadDTO, IClientResumoDTO } from '../@types/dtos';

const prisma = new PrismaClient();

export async function FetchClientsService(offset: number, limit: number, filter: string) {
  const clients = await prisma.client.findMany({
    where: {
      OR: [{ name: { startsWith: filter } }, { cpf: { startsWith: filter } }, { cnpj: { startsWith: filter } }],
    },
    orderBy: { id: 'asc' },
    skip: offset,
    take: limit,
  });

  return clients;
}

export async function FetchClientsResumeService() {
  const clients = (await prisma.client.findMany({
    select: {
      id: true,
      name: true,
    },
  })) as IClientResumoDTO[];

  return clients;
}

export async function FetchClientByIdService(clientId: number) {
  const client = await prisma.client.findUnique({
    where: {
      id: clientId
    }
  });

  return client;
}

export async function CountClientsService() {
  const count = await prisma.client.count();
  return count;
}

export async function CreateClientService(client: IClientCadDTO) {
  await prisma.client.create({
    data: {
      name: client.name,
      cpf: client.cpf,
      cnpj: client.cnpj,
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
