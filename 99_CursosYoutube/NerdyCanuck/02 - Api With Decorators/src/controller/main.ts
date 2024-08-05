import { NextFunction, Request, Response } from "express";
import { Controller } from "../decorators/controller";
import { Route } from "../decorators/router";

@Controller('')
class MainController {
  @Route('get', '/healthcheck')
  @Route('post', '/healthcheck')
  getHealthCheck(req: Request, res: Response, next: NextFunction) {
    logging.info('Healthcheck route called successfully!');
    return res.status(200).json({ hello: 'world!', ...req.body });
  }
}

export default MainController;