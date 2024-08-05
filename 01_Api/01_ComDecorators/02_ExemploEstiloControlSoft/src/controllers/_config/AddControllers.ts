import { Express } from 'express';
import path from 'path';
import { srcPath } from '../../util/basePaths';
import { logginHandler } from '../../middlewares/loggingHandler';
import { InjectAPIRoutes } from './decorators/implementation/InjectAPIRoutes';

export async function AddControllers(app: Express) {
  app.use(logginHandler);
  await InjectAPIRoutes(app, path.join(srcPath, "/controllers"));
}