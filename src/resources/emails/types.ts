export interface EmailAttachment {
  /** File name shown to the recipient, e.g. "invoice.pdf". */
  filename: string;
  /** File body as a Buffer or a base64-encoded string. */
  content: Buffer | string;
  /** Optional MIME type, e.g. "application/pdf". */
  contentType?: string;
}

export interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
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
