import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];

  if (!token || !token.replace('Bearer', '').trim()) {
    return res.status(401).send({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }
}
