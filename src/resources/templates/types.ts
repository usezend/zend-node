export interface TemplateVariable {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
}

export interface TemplateChannelVariant {
  channel: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  header?: string;
  footer?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  systemCategory?: string;
  status: string;
  visibility?: string;
  isWhatsappApproved?: boolean;
  variables?: TemplateVariable[];
  channelVariants?: TemplateChannelVariant[];
  usageCount?: number;
  createdAt?: string;
  approvedAt?: string;
}

export interface TemplateList {
  templates: Template[];
  total: number;
}

export interface ListTemplatesParams {
  category?: string;
  status?: string;
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
}
