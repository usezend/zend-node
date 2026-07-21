export interface VoiceFallback {
  sms: boolean;
  smsText?: string;
  senderId?: string;
}

export interface SendVoiceOptions {
  recipients: string[];
  text?: string;
  voiceUrl?: string;
  voice?: 'female' | 'male';
  retry?: boolean;
  callbackUrl?: string;
  fallback?: VoiceFallback;
}

export interface VoiceBatch {
  batchId: string;
  status?: string;
  total?: number;
  recipients?: Array<{ phoneNumber: string; status: string }>;
  createdAt?: string;
}

export interface VoiceBatchList {
  batches: VoiceBatch[];
  total: number;
}

export interface VoiceUpload {
  url: string;
}
