import { ControllerType, IParamToExtract } from "../util/types";

export class Container {
  static controllers: { [key: string]: ControllerType } = {};
  static paramsToExtract: { [key: string]: IParamToExtract } = {};
}

export function CheckController(key: string) {
  if (!Container.controllers[key]) {
    Container.controllers[key] = {
      path: "/",
      loadedController: false,
      routes: [],
      apps: [],
      middlewares: []
    };
  }
}
