import { Request, Response } from "express";
import { Body, Get, Param, Query, Route } from "../_config/decorators";
import { IHttpRequest, IHttpResponse } from "../_config/decorators/util/httpAdapter";
import myLogs from "../../config/general/logging";

@Route('/teste')
export class TesteController {
  @Get({ path: '/', authorize: false })
  testeGet(
    /*
    _: Request, 
    res: Response
    */
    req: IHttpRequest,
    res: IHttpResponse
  ) {
    res.status(200).json({ hello: 'world!' });
  }
}