export interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface Email {
  id: string;
  status?: string;
  from?: string;
  to?: string;
  subject?: string;
  html?: string;
  text?: string;
  cost?: number;
  userId?: string;
  externalId?: string;
  deliveredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EmailList = Email[];
