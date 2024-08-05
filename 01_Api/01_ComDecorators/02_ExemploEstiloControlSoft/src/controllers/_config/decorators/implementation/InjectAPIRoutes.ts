import { Express, Request, Response, NextFunction } from 'express';
import { authorize } from '../../../../middlewares/authorize.middleware';
import { Container } from './Container';
import { InjectParamsInMethod } from './ParamExtractor';
import { getControllers } from './Utils';
import { resolve } from '../../../../middlewares/adapter.middleware';
import path from 'path';

export async function InjectAPIRoutes(api: Express, controllersPath: string) {
  getControllers(controllersPath).forEach(async (controller) => {
    const splitedControllerPath = controller.substring(controllersPath.length, controller.length).split(path.sep);

    splitedControllerPath.splice(-1);

    const versionPath = splitedControllerPath.join('/');
    const obj = require(controller);
    const controllerName = Object.getOwnPropertyNames(obj)[1];

    if (Container.controllers[controllerName]) {
      Container.controllers[controllerName].path = `${versionPath}/${Container.controllers[controllerName].path}`;
    }
  });

  const createdRoutes: any[] = [];

  for (const item in Container.controllers) {
    const control = Container.controllers[item]

    if (control.loadedController) {
      control.routes.map(route => {
        const fn = InjectParamsInMethod(route, item)
        const path = (control.path + route.path || "").replace("//", "/")

        let middleware = [];

        if (control.apps.length > 0) {
          const mdw = (req: Request, res: Response, next: NextFunction) => {
            req.appsValid = control.apps;
            next();
          }

          middleware.push(mdw);
        }

        if (route.authorize) {
          middleware.push(authorize(route.usePublicKey));
        }

        if (route.middleware) {
          middleware = [...middleware, ...route.middleware]
        }

        api[route.type ?? 'get'](path, middleware, resolve(fn))
        createdRoutes.push({ type: route.type?.toUpperCase(), path, authorize: route.authorize ? 'V' : 'X' })
      })
    }
  }

  if (createdRoutes.length > 0) {
    console.log('\n[API ROUTES]');
    console.table(createdRoutes);
  }
}
