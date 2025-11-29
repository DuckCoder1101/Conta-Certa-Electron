import { ipcMain } from 'electron';

import { PrismaClient } from '@prisma/client';
import { ClientCadDTO } from './@types/dtos';

const prisma = new PrismaClient();

export default async function HandleIPCEvents() {
	ipcMain.handle('load-clients', async (_event, offset = 0, limit = 30) => {
		try {
			console.log('Fetching clients.');

			const clients = await prisma.client.findMany({
				orderBy: { id: 'asc' },
				skip: offset,
				take: limit,
			});

			return {
				data: clients,
				error: null,
			};
		} catch (err) {
			console.error('Error fetching clients:', err);

			return {
				data: null,
				error: 'Falha ao buscar clientes.',
			};
		}
	});

	ipcMain.handle('save-client', async (_event, client: ClientCadDTO) => {
        console.log('Saving client:', client.name);
    
		try {
			await prisma.client.upsert({
				where: { id: client.id },
				create: client,
				update: {
					name: client.name,
					email: client.email,
					phone: client.phone,
					fee: client.fee,
					feeDueDay: client.feeDueDay,
				},
			});

			return {
				success: true,
				error: null,
			};
		} catch (err) {
			console.error('Error saving client:', err);

			return {
				success: false,
				error: 'Falha ao salvar cliente.',
			};
		}
	});

	ipcMain.handle('delete-client', async (_event, clientId: number) => {
		console.log("Deleting client...");

		try {
			await prisma.client.delete({
				where: {
					id: clientId
				}
			});

			return {
				success: true,
				error: false,
			};
		} catch (err) {
			console.log(err);
			
			return {
				success: false,
				error: "Falha ao excluir cliente!"
			};
		}
	});
}
