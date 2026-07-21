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

/** Acknowledgement returned by `send()` when a voice batch is submitted. */
export interface VoiceSendResult {
  batchId: string;
  recipients: number;
  messageIds: string[];
  status: string;
  creditsReserved?: number;
}

export interface VoiceCounts {
  total: number;
  answered: number;
  noAnswer: number;
  busy: number;
  failed: number;
  fallbackSent: number;
}

export interface VoiceBatch {
  batchId: string;
  source?: string;
  text?: string;
  voice?: 'female' | 'male';
  audioUrl?: string;
  status: string;
  counts?: VoiceCounts;
  unitCost?: number;
  creditsReserved?: number;
  errorMessage?: string;
  createdAt?: string;
}

export interface VoiceRecipient {
  id: string;
  to: string;
  status: string;
  errorMessage?: string;
  voiceRefunded?: boolean;
  fallbackSmsSent?: boolean;
}

/** Returned by `get(batchId)` — the batch plus its per-recipient results. */
export interface VoiceBatchDetail {
  batch: VoiceBatch;
  recipients: VoiceRecipient[];
}

export interface VoiceBatchList {
  batches: VoiceBatch[];
  total: number;
  page?: number;
  limit?: number;
}

export interface VoiceUpload {
  url: string;
}
