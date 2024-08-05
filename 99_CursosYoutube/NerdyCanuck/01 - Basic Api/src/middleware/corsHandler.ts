import { NextFunction, Request, Response } from "express";

export function corsHandler(req: Request, res: Response, next: NextFunction) {
  res.header("Acces-Control-Allow-Origin", req.header('origin'));
  res.header("Acces-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header("Acces-Control-Allow-Credentials", 'true');

  if (req.method === 'OPTIONS') {
    res.header("Acces-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
}