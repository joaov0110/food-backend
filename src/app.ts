import 'reflect-metadata';
import env from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import express, { urlencoded, json, Router } from 'express';

import tenantInjector from './interfaces/injectors/tenantInjector';
import errorHandler from './utils/errors/errorHandler';

class Main {
  public app;
  private tenantController: Router;

  constructor() {
    env.config();
    this.app = express();

    this.configApp();

    this.setupControllers();

    this.useErrorHandlers();
  }

  private configApp() {
    this.app.use(
      cors({
        origin: 'http://localhost:4005',
        credentials: true,
      }),
    );
    this.app.use(morgan('dev'));
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());
  }

  private setupControllers() {
    this.tenantController = tenantInjector;

    this.useControllers();
  }

  private useControllers() {
    this.app.use('/api/tenants', this.tenantController);
  }

  private useErrorHandlers() {
    this.app.use(errorHandler.logErrorMiddleware);
    this.app.use(errorHandler.returnError);

    this.catchProgrammerErrors();
  }

  private catchProgrammerErrors() {
    process.on('unhandledRejection', (error) => {
      throw error;
    });

    process.on('uncaughtException', (error: Error) => {
      errorHandler.logError(error);

      if (!errorHandler.isOperationalError(error)) {
        process.exit(1);
      }
    });
  }
}

const main = new Main();

export default main.app;
