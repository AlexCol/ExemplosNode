import pino from "pino";
import type { PrettyOptions } from "pino-pretty";
import { pipeline } from "stream";
import { promisify } from "util";

const options: PrettyOptions = {
  colorize: true,
  ignore: "pid,hostname",
};

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options,
  },
});

const pipelineAsync = promisify(pipeline);

export { logger, pipelineAsync, promisify };

