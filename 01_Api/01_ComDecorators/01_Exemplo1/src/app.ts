import express from 'express';
import bodyParser from 'body-parser';
import { applyRoutes } from './decorators/implements';
import { AuthController } from './controllers/authController';
import { logginHandler } from './middlewares/loggingHandler';

const app = express();
app.use(express.json())

app.use(logginHandler);
applyRoutes(app, [AuthController]);

export { app };
