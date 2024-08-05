import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Route, Get, Post } from '../decorators/implements';
import { SECRET_KEY } from '../config/config';

@Route('/auth')
export class AuthController {
  @Post('/login')
  login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (username === 'Ale' && password === '123') {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
      return res.send({ token });
    }

    res.status(401).send({ message: 'Invalid credentials' });
  }

  @Post('/protected', true)
  protectedRoute(req: Request, res: Response) {
    res.send({ message: 'This is a protected route', user: (req as any).user });
  }

  @Get('/public')
  publicRoute(req: Request, res: Response) {
    res.send({ message: 'This is a public route' });
  }
}
