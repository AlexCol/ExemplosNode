import { NextFunction, Request, Response } from "express";

export interface IHttpRequest {
  request: Request;
  body: Request['body']
  query: Request['query']
  params: Request['params']
  ip: Request['ip']
  method: Request['method']
  path: Request['path']
  token: Request['token']
  userAgent: string | undefined
  headers: Request['headers']
}

export interface IHttpResponse {
  setHeader(name: string, value: string): Response<any, Record<string, any>>;
  json(value: any): Response<any, Record<string, any>>;
  status(code: number): Response<any, Record<string, any>>;
  send(value?: any): Response<any, Record<string, any>>;
  sendFile(path: string, cb: (err: Error) => void): void;
  redirect(url: string, status?: number): void;
  end(): Response<any, Record<string, any>>;
}

export interface HttpHandler {
  (request: IHttpRequest, response: IHttpResponse): void;
  (...args: any): void;
}

export class HttpRequest implements IHttpRequest {
  request: Request;

  body: Request['body']
  query: Request['query']
  params: Request['params']
  ip: Request['ip']
  method: Request['method']
  path: Request['path']
  token: any
  userAgent: string | undefined
  headers: Request['headers']

  constructor(req: Request) {
    this.request = req;
    this.body = req.body;
    this.query = req.query;
    this.params = req.params;
    this.ip = req.ip;
    this.method = req.method;
    this.path = req.path;
    this.token = req.token;
    this.userAgent = req.get('User-Agent');
    this.headers = req.headers;
  }
}

export class HttpResponse implements IHttpResponse {
  response: Response;

  constructor(respose: Response) {
    this.response = respose;
    this.response.status(200);
  }

  setHeader(name: string, value: string) {
    return this.response.setHeader(name, value);
  }

  json(value: any) {
    return this.response.json(value);
  }

  status(code: number) {
    return this.response.status(code);
  }

  send(value?: any) {
    return this.response.send(value);
  }

  sendFile(path: string, cb: (err: Error) => void) {
    return this.response.sendFile(path, cb);
  }

  redirect(url: string, status: number = 302) {
    this.response.redirect(status, url);
  }

  end() {
    return this.response.end();
  }
}
