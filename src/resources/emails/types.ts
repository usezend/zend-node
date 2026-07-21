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
  createdAt?: string;
}

export type EmailList = Email[];
