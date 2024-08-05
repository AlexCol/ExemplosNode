import http from 'http';
import express from "express";
import './config/logging';
import { logginHandler } from './middleware/loggingHandler';
import { corsHandler } from './middleware/corsHandler';
import { routeNotFound } from './middleware/routeNotFound';
import { SERVER } from './config/config';

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = () => {
  logging.info('----------------------------------------------------');
  logging.info('Iniciando Api.');
  logging.info('----------------------------------------------------');
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  logging.info('----------------------------------------------------');
  logging.info('Logging e Configuração');
  logging.info('----------------------------------------------------');
  app.use(logginHandler);
  app.use(corsHandler);

  logging.info('----------------------------------------------------');
  logging.info('Define Controller Routing');
  logging.info('----------------------------------------------------');
  app.get('/main/healthcheck', (req, res, next) => {
    return res.status(200).json({ hello: "world!" });
  });
  app.get('/main/healthcheck2', (req, res, next) => {
    return res.status(200).json({ hello: "world2!" });
  });

  logging.info('----------------------------------------------------');
  logging.info('Define Controller Routing');
  logging.info('----------------------------------------------------');
  app.use(routeNotFound);

  logging.info('----------------------------------------------------');
  logging.info('Start Server');
  logging.info('----------------------------------------------------');
  httpServer = http.createServer(app);
  httpServer.listen(SERVER.SERVER_PORT, () => {
    logging.info('----------------------------------------------------');
    logging.info(`Server started: ${SERVER.SERVER_HOSTNAME}:${SERVER.SERVER_PORT}`);
    logging.info('----------------------------------------------------');
  })
}

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();