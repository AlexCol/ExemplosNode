import { Request, Response, NextFunction, Router } from 'express';

const stuffRouter = Router();

stuffRouter.get('/', (req: Request, res: Response) => {

  return res.send({ Mensagem: 'Deu boa. Foi autorizado.' });
})

export default stuffRouter;