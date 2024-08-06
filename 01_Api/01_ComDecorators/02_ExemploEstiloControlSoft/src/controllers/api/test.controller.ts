import { Request, Response } from "express";
import { Body, Get, Param, Query, Route } from "../_config/decorators";
import { IHttpRequest, IHttpResponse } from "../_config/decorators/util/httpAdapter";
import myLogs from "../../config/general/logging";

@Route()
export class TesteController {
  @Get({ path: '/teste', authorize: false })
  testeGet(
    /*
    _: Request, 
    res: Response
    */
    @Query('id') id: number,
    //req: IHttpRequest, //pra usar @Query não pode ter a request
    res: IHttpResponse
  ) {
    res.status(200).json({ hello: 'world!', id });
  }
}