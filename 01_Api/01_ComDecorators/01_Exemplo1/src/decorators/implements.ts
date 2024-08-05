import 'reflect-metadata'; // Importa o módulo necessário para trabalhar com metadados usando a biblioteca 'reflect-metadata'
import { Request, Response, NextFunction, Router } from 'express'; // Importa tipos do Express para criar rotas e middlewares
import { authMiddleware } from '../middlewares/authMiddleware'; // Importa middleware para autenticação
import { logginHandler } from '../middlewares/loggingHandler'; // Importa middleware para registro de logs (não está sendo utilizado no código fornecido)

interface RouteDefinition {
  path: string; // Caminho da rota
  method: 'get' | 'post' | 'delete' | 'put' | 'patch'; // Método HTTP da rota
  handlerName: string; // Nome do método do controlador que manipula a rota
  authorize: boolean; // Indica se a rota requer autenticação
}

// Chave de símbolo para armazenar e recuperar metadados das rotas
export const RouterMetadataKey = Symbol('routes');

// Decorador para definir o prefixo de rota para um controlador
export function Route(path: string): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('path', path, target); // Define o prefixo de rota usando metadados
  };
}

// Decorador para definir uma rota GET
export function Get(path: string, authorize: boolean = false): MethodDecorator {
  return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    // Recupera rotas existentes ou inicializa um array vazio
    const routes: RouteDefinition[] = Reflect.getMetadata(RouterMetadataKey, target.constructor) || [];
    // Adiciona uma nova definição de rota ao array
    routes.push({ path, method: 'get', handlerName: propertyKey as string, authorize });
    // Define os metadados atualizados no controlador
    Reflect.defineMetadata(RouterMetadataKey, routes, target.constructor);
  };
}

// Decorador para definir uma rota POST
export function Post(path: string, authorize: boolean = false): MethodDecorator {
  return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    // Recupera rotas existentes ou inicializa um array vazio
    const routes: RouteDefinition[] = Reflect.getMetadata(RouterMetadataKey, target.constructor) || [];
    // Adiciona uma nova definição de rota ao array
    routes.push({ path, method: 'post', handlerName: propertyKey as string, authorize });
    // Define os metadados atualizados no controlador
    Reflect.defineMetadata(RouterMetadataKey, routes, target.constructor);
  };
}

// Função para aplicar as rotas dos controladores ao roteador
export function applyRoutes(app: Router, controllers: any[]) {
  // Itera sobre cada controlador fornecido
  controllers.forEach((controller) => {
    // Cria uma instância do controlador
    const instance = new controller();
    // Recupera o prefixo de rota definido para o controlador
    const prefix = Reflect.getMetadata('path', controller);
    // Recupera as rotas definidas para o controlador
    const routes: RouteDefinition[] = Reflect.getMetadata(RouterMetadataKey, controller) || [];

    // Itera sobre cada definição de rota
    routes.forEach((route) => {
      const fullPath = prefix + route.path; // Constrói o caminho completo da rota
      if (route.authorize) {
        // Se a rota requer autenticação, aplica o middleware de autenticação
        app[route.method](fullPath, authMiddleware, instance[route.handlerName].bind(instance));
      } else {
        // Caso contrário, apenas adiciona o manipulador da rota
        app[route.method](fullPath, instance[route.handlerName].bind(instance));
      }
    });
  });
}
