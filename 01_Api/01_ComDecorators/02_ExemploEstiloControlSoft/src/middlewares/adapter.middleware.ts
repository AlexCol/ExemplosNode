import { Request, Response, NextFunction } from 'express'
import { HttpHandler, HttpRequest, HttpResponse } from '../controllers/_config/decorators/util/httpAdapter';

const resolve = (handlerFn: HttpHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = new HttpRequest(req);
    const httpResponse = new HttpResponse(res)

    try {
      await Promise.resolve(handlerFn(httpRequest, httpResponse));
      httpResponse.end();
    } catch (err) {
      return next(err);
    }
  }

export { resolve }
