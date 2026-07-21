export type Channel = 'sms' | 'whatsapp';
export type MessageStatus =
  | 'pending' | 'queued' | 'processing' | 'sent' | 'delivered' | 'failed' | 'cancelled';

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

export interface Message {
  id: string;
  status: MessageStatus;
  estimatedCost?: number;
  message?: string;
  to?: string;
  channel?: Channel;
  createdAt?: string;
}

export interface MessageList {
  messages: Message[];
  total: number;
}

export interface BulkMessageResult {
  total?: number;
  queued?: number;
  messages?: Message[];
}
