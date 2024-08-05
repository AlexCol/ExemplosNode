import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../configuration/general/config';

const authRouter = Router();

authRouter.post('/', (req: Request, res: Response) => {
  const { username, password } = req.body;

  const isAuth = username === 'Ale' && password === '123';

  if (!isAuth) {
    res.status(401);
    return res.json({ erro: 'Não autorizado!' });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  return res.send({ token });
})

export default authRouter;