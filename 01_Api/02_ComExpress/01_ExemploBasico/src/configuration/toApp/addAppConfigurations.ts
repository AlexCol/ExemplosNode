import { Express } from "express";
import { appAddRoutes } from "./appAddRoutes";
import { addGlobalMiddlewares } from "./addGlobalMiddlewares";

export function addAppConfigurations(app: Express) {
  addGlobalMiddlewares(app);
  appAddRoutes(app);
}