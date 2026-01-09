import { PrismaClient, Service } from '@prisma/client';
import { IServiceCadDTO } from '../@types/dtos';

const prisma = new PrismaClient();

export async function FetchServicesService(offset: number, limit: number, filter: string) {
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

  return services;
}

export async function CreateServiceService(service: IServiceCadDTO) {
  await prisma.service.create({
    data: {
      name: service.name,
      value: service.value,
    },
  });
}

export async function EditServiceService(service: Service) {
  await prisma.service.update({
    where: {
      id: service.id,
    },
    data: {
      name: service.name,
      value: service.value,
    },
  });
}

export async function DeleteServiceService(serviceId: number) {
  await prisma.service.delete({
    where: {
      id: serviceId,
    },
  });
}
