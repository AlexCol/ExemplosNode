import { NextFunction, Request, Response } from "express";
import logging from "../config/logging";

export function logginHandler(req: Request, res: Response, next: NextFunction) {
  logging.log(`Incomming - METHOD [${req.method}] - URL: [${req.url}]`);

  res.on("finish", () => {
    logging.log(`Incomming - METHOD [${req.method}] - URL: [${req.url}] -> STATUS: [${res.statusCode}]`);
  });

  next();
}