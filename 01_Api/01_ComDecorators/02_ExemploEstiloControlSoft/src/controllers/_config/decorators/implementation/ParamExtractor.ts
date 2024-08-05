import "reflect-metadata";
import { IPropertyDecorator, IRouteProps } from "../util/types";
import { Container } from "./Container";
import { HttpHandler, IHttpRequest, IHttpResponse } from "../util/httpAdapter";
import myLogs from "../../../../config/general/logging";

export function Token(): IPropertyDecorator {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const key = `${target.constructor.name}-${propertyKey}-TOKEN`
    Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName: '', origin: 'TOKEN' });
  }
}

export function Param(parameterName: string): IPropertyDecorator {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const key = `${target.constructor.name}-${propertyKey}-${parameterName}`;
    Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName, origin: 'PARAM' });
  }
}

export function Query(parameterName: string): IPropertyDecorator {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const key = `${target.constructor.name}-${propertyKey}-${parameterName}`;
    Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName, origin: 'QUERY' });
  }
}

export function Header(parameterName: string): IPropertyDecorator {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const key = `${target.constructor.name}-${propertyKey}-${parameterName}`;
    Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName, origin: 'HEADER' });
  }
}

export function FromBody(parameterName: string): IPropertyDecorator {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const key = `${target.constructor.name}-${propertyKey}-${parameterName}`;
    Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName, origin: 'BODY' });
  }
}

export function Body(): IPropertyDecorator {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const key = `${target.constructor.name}-${propertyKey}-body`;
    Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName: '', origin: 'BODY' });
  }
}

const paramOriginMapping: { [key: string]: (req: IHttpRequest) => any } = {
  'BODY': (req: IHttpRequest) => req.body,
  'HEADER': (req: IHttpRequest) => req.headers,
  'PARAM': (req: IHttpRequest) => req.params,
  'QUERY': (req: IHttpRequest) => req.query,
  'TOKEN': (req: IHttpRequest) => req.token,
};

export function InjectParamsInMethod(route: IRouteProps, control: any): HttpHandler {
  var paramsExtract: any[] = [];

  for (const param in Container.paramsToExtract) {
    const paramSplited = param.split('-')
    const className = paramSplited[0];
    const funcName = paramSplited[1];

    if (className != control) continue;

    if (param.startsWith(className) && (route.method.name === funcName)) {
      paramsExtract.push({
        target: Container.paramsToExtract[param].target,
        name: Container.paramsToExtract[param].parameterName,
        index: Container.paramsToExtract[param].parameterIndex,
        origin: Container.paramsToExtract[param].origin
      });
    }
  }

  const params = [...new Set(paramsExtract)].reverse();

  if (params.length === 0) {
    return route.method
  } else {
    return function (req: IHttpRequest, res: IHttpResponse) {
      let args: any[] = [];
      for (const item of params) {
        let arg;

        const getValueFromRequest = paramOriginMapping[item.origin];
        if (getValueFromRequest) {
          const value = getValueFromRequest(req);
          arg = item.name !== '' ? value[item.name] : value;
        }

        const paramTypes = Reflect.getMetadata('design:paramtypes', item.target, route.method.name);
        const paramType = paramTypes[item.index];

        // Converter o argumento para o tipo correto
        if (paramType) {
          arg = convertArgumentToType(arg, paramType);
        }

        args.push(arg)
      }

      if (args.length == 0) args.push(req)

      //Response is a default last param um controller
      args.push(res);
      return Promise.resolve(route.method.apply(route.method, args));
    }
  }
}

function convertArgumentToType(arg: any, type: any): any {
  if ((typeof type === 'function') && (type.isZodSchema || type.isZodArraySchema)) {
    return type.schema.parse(arg);
  }

  if (type === Array) {
    if (arg !== undefined) {
      return arg.split(",");
    } else {
      return [];
    }
  }

  if (type === Number) return parseInt(arg ?? 0);

  if (type === Boolean) {
    if (arg !== undefined)
      return arg.toLowerCase() === "true" || arg === "1";
    else
      return false;
  }

  return arg;
}
