export interface ProcessResponse {
  originalMessage?: any;
  processedAt: Date;
  status: 'SUCCESS' | 'ERROR';
  processedBy: string;
  result?: string;
  error?: string;
}
