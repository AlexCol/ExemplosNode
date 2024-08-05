import { Express } from 'express';
import { logginHandler } from '../../middleware/loggingHandler';

export function addGlobalMiddlewares(app: Express) {
  app.use(logginHandler);
}