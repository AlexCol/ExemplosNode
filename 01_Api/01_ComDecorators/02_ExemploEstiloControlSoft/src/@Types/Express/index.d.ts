declare namespace Express {
  interface Request {
    token?: any;
    appsValid?: string[];
  }
}