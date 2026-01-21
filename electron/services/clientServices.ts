import { Client, PrismaClient } from '@prisma/client';

import { IClientCadDTO, IClientResumoDTO } from '../@types/dtos';
import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';

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
      id: clientId,
    },
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

export async function ImportClientsService(filePath: string) {
  // Lê e converte o arquivo CSV
  const parser = createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }),
  );

  const data: IClientCadDTO[] = [];
  let fails: number = 0;

  for await (const line of parser) {
    const client = line as IClientCadDTO;

    // Checagem de campos
    if ((!client.cpf && !client.cnpj) || !client.name || !client.phone || !client.fee || !client.feeDueDay) {
      fails++;
    }

    data.push(client);
  }

  // Buscar CPFs/CNPJs existentes
  const existing = await prisma.client.findMany({
    select: {
      cpf: true,
      cnpj: true,
    },
  });

  // Filtra o CSV
  const existingSet = new Set(existing.flatMap((c) => [c.cpf, c.cnpj]).filter(Boolean));
  const filtered = data.filter((client) => !existingSet.has(client.cpf) && !existingSet.has(client.cnpj));

  await prisma.client.createMany({
    data: filtered,
  });

  return fails;
}
