import { HttpHandler } from "./httpAdapter";

export type Constructor = {
  new(...args: any[]): {}
}

export type RouteType = "get" | "post" | "put" | "patch" | "delete";

export interface IEndPointProps {
  path?: string;
  authorize?: boolean;
  middleware?: HttpHandler[];
  type?: RouteType;
  usePublicKey?: boolean;
}

export interface IParamToExtract {
  target: any;
  methodName: string;
  parameterIndex: number;
  parameterName: string;
  origin?: string;
}

export interface IFunctionDecorator {
  (target: any, propertyName: string, prop: PropertyDescriptor): void;
}

export interface IRouteProps extends IEndPointProps {
  method: HttpHandler;
}

export interface IPropertyDecorator {
  (target: any, propertyKey: string, parameterIndex: number): void
}

export type ControllerType = {
  loadedController: boolean;
  path: string;
  apps: string[];
  middlewares: HttpHandler[];
  routes: IRouteProps[];
}