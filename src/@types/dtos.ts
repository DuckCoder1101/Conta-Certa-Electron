export interface IClientFormDTO {
	cpf: string | null;
	cnpj: string | null;
	name: string;
	email: string | null;
	phone: string;
	fee: number;
	feeDueDay: number;
}

export interface IClient {
	id: number;
	cpf: string | null;
	cnpj: string | null;
	name: string;
	email: string | null;
	phone: string;
	fee: number;
	feeDueDay: number;
}

export interface IClientResumeDTO {
	id: number;
	name: string;
}

export interface IAppError {
	status: number;
	message: string;
}

export interface IAppResponseDTO<T> {
	success: boolean;
	data: T | null;
	error: IAppError | null;
}

export interface IService {
	id: number;
	name: string;
	value: number;
}

export interface IServiceBilling {
	id: number;
	name: string;
	value: number;
	quantity: number;

	serviceOriginId: number;
	billingId: number;
}

export interface IServiceBillingFormDTO {
	id: number | null;
	name: string;
	value: number;
	quantity: number;
	serviceOriginId: number;
}

export type BillingStatus = 'pending' | 'paid';
export interface IBilling {
	id: number;
	fee: number;
	status: BillingStatus;
	dueDate: Date;
	paidAt: Date | null;

	client: IClientResumeDTO;
	serviceBillings: IServiceBilling[];
}

export interface IBillingFormDTO {
	id: number;
	fee: number;
	status: BillingStatus;
	dueDate: string;
	paidAt: string | null;

	clientId: number;
	serviceBillings: IServiceBillingFormDTO[];
}