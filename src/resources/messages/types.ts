export type Channel = 'sms' | 'whatsapp';
export type MessageStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export interface SendMessageOptions {
  to: string;
  body?: string;
  preferredChannels?: Channel[];
  templateId?: string;
  templateParams?: Record<string, unknown>;
  senderId?: string;
  scheduledFor?: string;
  fallbackEnabled?: boolean;
  webhookUrl?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  deliveryPriority?: 'cost' | 'speed' | 'reliability';
}

export interface BulkMessageItem {
  to: string;
  body: string;
  templateParams?: Record<string, unknown>;
  campaignId?: string;
}

export interface BulkMessageOptions {
  messages: BulkMessageItem[];
  preferredChannels?: Channel[];
  templateId?: string;
  fallbackEnabled?: boolean;
  deliveryPriority?: 'cost' | 'speed' | 'reliability';
  webhookUrl?: string;
  senderId?: string;
}

/** Acknowledgement returned by `send()` when a message is queued. */
export interface SendMessageResult {
  id: string;
  status: MessageStatus;
  estimatedCost?: number;
  message?: string;
}

export interface DeliveryAttempt {
  channel: Channel;
  status: string;
  attemptedAt?: string;
  cost?: number;
  errorMessage?: string;
}

/** Full message record returned by `get()` and within `list()`. */
export interface Message {
  id: string;
  status: MessageStatus;
  channelUsed?: Channel;
  to?: string;
  body?: string;
  totalCost?: number;
  deliveryAttempts?: DeliveryAttempt[];
  createdAt?: string;
  sentAt?: string;
  errorMessage?: string;
}

export interface MessageList {
  messages: Message[];
  total: number;
  page?: number;
  pages?: number;
}

export interface BulkMessageResult {
  total?: number;
  queued?: number;
  messages?: SendMessageResult[];
}
