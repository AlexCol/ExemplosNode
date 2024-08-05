import { Express } from 'express';
import router from '../../routes/router';

export function appAddRoutes(app: Express) {
  app.use('/', router);
}