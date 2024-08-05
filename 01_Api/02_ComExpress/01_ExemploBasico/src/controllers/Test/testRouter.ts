import express, { Router, Request, Response } from 'express';

const testRouter = Router();

testRouter.get('/', (req: Request, res: Response) => {
  res.json({ hello: 'world' });
})

export default testRouter;