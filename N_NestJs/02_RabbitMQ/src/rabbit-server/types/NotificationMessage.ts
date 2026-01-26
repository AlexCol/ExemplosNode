export interface NotificationMessage {
  type: 'cats';
  recipient: string;
  subject?: string;
  message: string;
  timestamp: Date;
}
