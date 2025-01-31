import { Contact } from 'baileys';

export interface QRCodeResponse {
  qrCode: string;
}

export interface AuthResponse {
  userData: Contact;
}
