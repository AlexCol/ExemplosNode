// import "reflect-metadata";
// import fs from 'fs';
// import path from 'path';
// import { Express, NextFunction, Request, Response } from 'express';
// import { authorize } from '../../../../middlewares/authorize.middleware';
// import { Constructor, ControllerType, IEndPointProps, IParamToExtract, IRouteProps, RouteType } from "../util/types";
// import { HttpHandler, IHttpRequest, IHttpResponse } from "../util/httpAdapter";
// import { resolve } from "../../../../middlewares/adapter.middleware";

// class Container {
//   static controllers: { [key: string]: ControllerType } = {};
//   static paramsToExtract: { [key: string]: IParamToExtract } = {};
// }

// function CheckController(key: string) {
//   if (!Container.controllers[key]) {
//     Container.controllers[key] = {
//       path: "/",
//       loadedController: false,
//       routes: [],
//       apps: [],
//       middlewares: []
//     };
//   }
// }

// function Inject(key: RouteType, props: IEndPointProps, fn: PropertyDescriptor) {
//   CheckController(key);

//   const routeProps = props as IRouteProps;
//   routeProps.method = fn.value;
//   routeProps.path = props.path || "";

//   Container.controllers[key].routes.push(routeProps);
//   return fn;
// }

// export function Route(params?: { path: string, apps?: string[], middlewares?: HttpHandler[] } | string) {
//   return function <T extends Constructor>(constructor: T): T | void {
//     if (!Container.controllers[constructor.name])
//       return;

//     if (Container.controllers[constructor.name].loadedController) {
//       throw new Error(`Classe de controller API duplicada!\nClasse: ${constructor.name}`);
//     }

//     let props: { path: string, apps: string[], middlewares: HttpHandler[] } = { path: "", apps: [], middlewares: [] };

//     if (!!params) {
//       if (typeof params === 'string') {
//         props.path = params ?? "";
//       } else {
//         props.path = params.path;
//         props.apps = params.apps ?? [];
//         props.middlewares = params.middlewares ?? [];
//       }
//     }

//     Container.controllers[constructor.name].loadedController = true;
//     Container.controllers[constructor.name].path = props.path;
//     Container.controllers[constructor.name].apps = props.apps;
//     Container.controllers[constructor.name].middlewares = props.middlewares;
//   }
// }

// interface IFunctionDecorator {
//   (target: any, propertyName: string, prop: PropertyDescriptor): void;
// }

// export function Get(props: IEndPointProps = {}): IFunctionDecorator {
//   props.type = 'get';
//   props.authorize = props.authorize ?? true;

//   return function (target: any, propertyName: string, prop: PropertyDescriptor) {
//     return Inject(target.constructor.name, props, prop);
//   }
// }

// export function Post(props: IEndPointProps = {}): IFunctionDecorator {
//   props.type = 'post';
//   props.authorize = props.authorize ?? true;

//   return function (target: any, propertyName: string, prop: PropertyDescriptor) {
//     return Inject(target.constructor.name, props, prop);
//   }
// }

// export function Patch(props: IEndPointProps = {}): IFunctionDecorator {
//   props.type = 'patch';
//   props.authorize = props.authorize ?? true;

//   return function (target: any, propertyName: string, prop: PropertyDescriptor) {
//     return Inject(target.constructor.name, props, prop);
//   }
// }

// export function Put(props: IEndPointProps = {}): IFunctionDecorator {
//   props.type = 'put';
//   props.authorize = props.authorize ?? true;

//   return function (target: any, propertyName: string, prop: PropertyDescriptor) {
//     return Inject(target.constructor.name, props, prop);
//   }
// }

// export function Delete(props: IEndPointProps = {}): IFunctionDecorator {
//   props.type = 'delete';
//   props.authorize = props.authorize ?? true;

//   return function (target: any, propertyName: string, prop: PropertyDescriptor) {
//     return Inject(target.constructor.name, props, prop);
//   }
// }

// interface IPropertyDecorator {
//   (target: any, propertyKey: string, parameterIndex: number): void
// }

// export function Token(): IPropertyDecorator {
//   return function (target: any, propertyKey: string, parameterIndex: number) {
//     const key = `${target.constructor.name}-${propertyKey}-TOKEN`
//     Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName: '', origin: 'TOKEN' });
//   }
// }

// export function Param(parameterName: string): IPropertyDecorator {
//   return function (target: any, propertyKey: string, parameterIndex: number) {
//     const key = `${target.constructor.name}-${propertyKey}-${parameterName}`;
//     Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName, origin: 'PARAM' });
//   }
// }

// export function Query(parameterName: string): IPropertyDecorator {
//   return function (target: any, propertyKey: string, parameterIndex: number) {
//     const key = `${target.constructor.name}-${propertyKey}-${parameterName}`;
//     Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName, origin: 'QUERY' });
//   }
// }

// export function Header(parameterName: string): IPropertyDecorator {
//   return function (target: any, propertyKey: string, parameterIndex: number) {
//     const key = `${target.constructor.name}-${propertyKey}-${parameterName}`;
//     Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName, origin: 'HEADER' });
//   }
// }

// export function FromBody(parameterName: string): IPropertyDecorator {
//   return function (target: any, propertyKey: string, parameterIndex: number) {
//     const key = `${target.constructor.name}-${propertyKey}-${parameterName}`;
//     Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName, origin: 'BODY' });
//   }
// }

// export function Body(): IPropertyDecorator {
//   return function (target: any, propertyKey: string, parameterIndex: number) {
//     const key = `${target.constructor.name}-${propertyKey}-body`;
//     Container.paramsToExtract[key] = ({ target: target, methodName: propertyKey, parameterIndex, parameterName: '', origin: 'BODY' });
//   }
// }

// const paramOriginMapping: { [key: string]: (req: IHttpRequest) => any } = {
//   'BODY': (req: IHttpRequest) => req.body,
//   'HEADER': (req: IHttpRequest) => req.headers,
//   'PARAM': (req: IHttpRequest) => req.params,
//   'QUERY': (req: IHttpRequest) => req.query,
//   'TOKEN': (req: IHttpRequest) => req.token,
// };

// function InjectParamsInMethod(route: IRouteProps, control: any): HttpHandler {
//   var paramsExtract: any[] = [];

//   for (const param in Container.paramsToExtract) {
//     const paramSplited = param.split('-')
//     const className = paramSplited[0];
//     const funcName = paramSplited[1];

//     if (className != control) continue;

//     if (param.startsWith(className) && (route.method.name === funcName)) {
//       paramsExtract.push({
//         target: Container.paramsToExtract[param].target,
//         name: Container.paramsToExtract[param].parameterName,
//         index: Container.paramsToExtract[param].parameterIndex,
//         origin: Container.paramsToExtract[param].origin
//       });
//     }
//   }

//   const params = [...new Set(paramsExtract)].reverse();

//   if (params.length === 0) {
//     return route.method
//   } else {
//     return function (req: IHttpRequest, res: IHttpResponse) {
//       let args: any[] = [];

//       for (const item of params) {
//         let arg;

//         const getValueFromRequest = paramOriginMapping[item.origin];
//         if (getValueFromRequest) {
//           const value = getValueFromRequest(req);
//           arg = item.name !== '' ? value[item.name] : value;
//         }

//         const paramTypes = Reflect.getMetadata('design:paramtypes', item.target, route.method.name);
//         const paramType = paramTypes[item.index];

//         // Converter o argumento para o tipo correto
//         if (paramType) {
//           arg = convertArgumentToType(arg, paramType);
//         }

//         args.push(arg)
//       }

//       if (args.length == 0) args.push(req)

//       //Response is a default last param um controller
//       args.push(res);
//       return Promise.resolve(route.method.apply(route.method, args));
//     }
//   }
// }

// function convertArgumentToType(arg: any, type: any): any {
//   if ((typeof type === 'function') && (type.isZodSchema || type.isZodArraySchema)) {
//     return type.schema.parse(arg);
//   }

//   if (type === Array) {
//     if (arg !== undefined) {
//       return arg.split(",");
//     } else {
//       return [];
//     }
//   }

//   if (type === Number) return parseInt(arg ?? 0);

//   if (type === Boolean) {
//     if (arg !== undefined)
//       return arg.toLowerCase() === "true" || arg === "1";
//     else
//       return false;
//   }

//   return arg;
// }

// function getControllers(dir: string, fileList: string[] = []): string[] {
//   const files = fs.readdirSync(dir);

//   files.forEach((file: string) => {
//     const filePath = path.join(dir, file);
//     const stats = fs.lstatSync(filePath);

//     if (stats.isDirectory()) {
//       fileList = getControllers(filePath, fileList);
//     } else if (file.includes('.controller')) {
//       fileList.push(path.resolve(filePath));
//     }
//   });

//   return fileList;
// }

// export async function InjectAPIRoutes(api: Express, controllersPath: string) {
//   getControllers(controllersPath).forEach(async (controller) => {
//     const splitedControllerPath = controller.substring(controllersPath.length, controller.length).split(path.sep);

//     splitedControllerPath.splice(-1);

//     const versionPath = splitedControllerPath.join('/');
//     const obj = require(controller);
//     const controllerName = Object.getOwnPropertyNames(obj)[1];

//     if (Container.controllers[controllerName]) {
//       Container.controllers[controllerName].path = `${versionPath}/${Container.controllers[controllerName].path}`;
//     }
//   });

//   const createdRoutes: any[] = [];

//   for (const item in Container.controllers) {
//     const control = Container.controllers[item]

//     if (control.loadedController) {
//       control.routes.map(route => {
//         const fn = InjectParamsInMethod(route, item)
//         const path = (control.path + route.path || "").replace("//", "/")

//         let middleware = [];

//         if (control.apps.length > 0) {
//           const mdw = (req: Request, res: Response, next: NextFunction) => {
//             req.appsValid = control.apps;
//             next();
//           }

//           middleware.push(mdw);
//         }

//         if (route.authorize) {
//           middleware.push(authorize(route.usePublicKey));
//         }

//         if (route.middleware) {
//           middleware = [...middleware, ...route.middleware]
//         }

//         api[route.type ?? 'get'](path, middleware, resolve(fn))
//         createdRoutes.push({ type: route.type?.toUpperCase(), path, authorize: route.authorize ? 'V' : 'X' })
//       })
//     }
//   }

//   if (createdRoutes.length > 0) {
//     console.log('\n[API ROUTES]');
//     console.table(createdRoutes);
//   }
// }
