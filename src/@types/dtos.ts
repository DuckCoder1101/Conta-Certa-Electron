export interface ClientFormDTO {
	cpf: string;
	cnpj: string;
	name: string;
	email: string;
	phone: string;
	fee: number;
	feeDueDay: number;
}

export interface Client {
	id: number;
	cpf?: string;
	cnpj?: string;
	name: string;
	email: string;
	phone: string;
	fee: number;
	feeDueDay: number;
}

export interface ClientResumeDTO {
	id: number;
	name: string;
}

export interface FetchDataDTO<T> {
	data: T[] | null;
	error: string | null;
}

export interface SaveDataResponseDTO {
	success: boolean;
	error: string | null;
}

export interface Service {
	id: number;
	name: string;
	value: number;
}

export interface ServiceBilling {
	id: number;
	name: string;
	value: number;
	quantity: number;

	serviceOriginId: number;
	billingId: number;
}

export interface ServiceBillingFormDTO {
	id: number | null;
	name: string;
	value: number;
	quantity: number
	serviceOriginId: number;
}

export type BillingStatus = 'pending' | 'paid';
export interface Billing {
	id: number;
	fee: number;
	status: BillingStatus;
	dueDate: Date;
	paidAt: Date | null;
	
	client: ClientResumeDTO;
	serviceBillings: ServiceBilling[];
}

export interface BillingFormDTO {
	id: number;
	fee: number;
	status: BillingStatus;
	dueDate: Date;
	paidAt: Date | null;
	
	clientId: number;
	serviceBillings: ServiceBillingFormDTO[];
}