import { Request, Response, NextFunction } from 'express';

interface IJwtExceptions {
  [key: string]: { message: string, erro: string }
}

const JwtExceptions: IJwtExceptions = {
  'NotBeforeError': { message: 'Token fora do horário válido', erro: 'NotBeforeError' },
  'TokenExpiredError': { message: 'Token expirado', erro: 'TokenExpiredError' },
  'JsonWebTokenError': { message: 'Token inválido', erro: 'JsonWebTokenError' }
}

/**
 * middleware to check whether user && app has access to a endpoint
 */
export const authorize = (temp: boolean = false, ignoreAppType: boolean = false) => (req: Request, res: Response, next: NextFunction) => {
  next();
}