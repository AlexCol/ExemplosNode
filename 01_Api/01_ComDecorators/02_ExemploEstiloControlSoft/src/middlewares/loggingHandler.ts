import { NextFunction, Request, Response } from "express";
import myLogs from "../config/general/logging";

export function logginHandler(req: Request, res: Response, next: NextFunction) {
  myLogs.log(`Incomming - METHOD [${req.method}] - URL: [${req.url}]`);

  res.on("finish", () => {
    myLogs.log(`Incomming - METHOD [${req.method}] - URL: [${req.url}] -> STATUS: [${res.statusCode}]`);
  });

  next();
}