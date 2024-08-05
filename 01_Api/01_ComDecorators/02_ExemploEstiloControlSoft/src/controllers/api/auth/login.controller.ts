
import { Post, Route } from "../../_config/decorators";
import { IHttpRequest, IHttpResponse } from "../../_config/decorators/util/httpAdapter";

@Route()
export class AuthController {
  @Post({ path: '/login', authorize: false, usePublicKey: true })
  login(
    req: IHttpRequest,
    res: IHttpResponse
  ) {
    const appType: string = req.headers['x-app-type'] as string;
    const credentials = req.body;
    res.status(200).json({ credentials });
  }
}