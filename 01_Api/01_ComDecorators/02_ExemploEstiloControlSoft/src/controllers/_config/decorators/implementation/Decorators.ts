import { HttpHandler } from "../util/httpAdapter";
import { Constructor, IEndPointProps, IRouteProps, RouteType } from "../util/types";
import { CheckController, Container } from "./Container";

function Inject(key: RouteType, props: IEndPointProps, fn: PropertyDescriptor) {
  CheckController(key);

  const routeProps = props as IRouteProps;
  routeProps.method = fn.value;
  routeProps.path = props.path || "";

  Container.controllers[key].routes.push(routeProps);
  return fn;
}

export function Route(params?: { path: string, apps?: string[], middlewares?: HttpHandler[] } | string) {
  return function <T extends Constructor>(constructor: T): T | void {
    if (!Container.controllers[constructor.name])
      return;

    if (Container.controllers[constructor.name].loadedController) {
      throw new Error(`Classe de controller API duplicada!\nClasse: ${constructor.name}`);
    }

    let props: { path: string, apps: string[], middlewares: HttpHandler[] } = { path: "", apps: [], middlewares: [] };

    if (!!params) {
      if (typeof params === 'string') {
        props.path = params ?? "";
      } else {
        props.path = params.path;
        props.apps = params.apps ?? [];
        props.middlewares = params.middlewares ?? [];
      }
    }

    Container.controllers[constructor.name].loadedController = true;
    Container.controllers[constructor.name].path = props.path;
    Container.controllers[constructor.name].apps = props.apps;
    Container.controllers[constructor.name].middlewares = props.middlewares;
  }
}

interface IFunctionDecorator {
  (target: any, propertyName: string, prop: PropertyDescriptor): void;
}

export function Get(props: IEndPointProps = {}): IFunctionDecorator {
  props.type = 'get';
  props.authorize = props.authorize ?? true;

  return function (target: any, propertyName: string, prop: PropertyDescriptor) {
    return Inject(target.constructor.name, props, prop);
  }
}

export function Post(props: IEndPointProps = {}): IFunctionDecorator {
  props.type = 'post';
  props.authorize = props.authorize ?? true;

  return function (target: any, propertyName: string, prop: PropertyDescriptor) {
    return Inject(target.constructor.name, props, prop);
  }
}

export function Patch(props: IEndPointProps = {}): IFunctionDecorator {
  props.type = 'patch';
  props.authorize = props.authorize ?? true;

  return function (target: any, propertyName: string, prop: PropertyDescriptor) {
    return Inject(target.constructor.name, props, prop);
  }
}

export function Put(props: IEndPointProps = {}): IFunctionDecorator {
  props.type = 'put';
  props.authorize = props.authorize ?? true;

  return function (target: any, propertyName: string, prop: PropertyDescriptor) {
    return Inject(target.constructor.name, props, prop);
  }
}

export function Delete(props: IEndPointProps = {}): IFunctionDecorator {
  props.type = 'delete';
  props.authorize = props.authorize ?? true;

  return function (target: any, propertyName: string, prop: PropertyDescriptor) {
    return Inject(target.constructor.name, props, prop);
  }
}
