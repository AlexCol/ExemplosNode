import express, { Express } from 'express';
import { AddControllers } from '../../controllers/_config/AddControllers';
import myLogs from '../general/logging';

export function addAppConfigurations(app: Express) {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  AddControllers(app);
}