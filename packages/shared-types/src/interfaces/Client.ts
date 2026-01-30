import { DocumentType } from '../enums/DocumentType';

export interface IClient {
  id: number;
  document: string;
  documentType: DocumentType;
  name: string;
  email: string | null;
  phone: string;
  fee: number;
  feeDueDay: number;
}
