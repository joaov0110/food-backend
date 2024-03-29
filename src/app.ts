import 'reflect-metadata';
import env from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import express, { urlencoded, json, Router } from 'express';

import tenantFactory from './interfaces/factories/tenantFactory';
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
        origin: 'http://localhost:5173',
        credentials: true,
      }),
    );
    this.app.use(morgan('dev'));
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());
  }

  private setupControllers() {
    this.tenantController = tenantFactory;

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

    process.on('uncaughtException', (error) => {
      errorHandler.logError(error);

      if (!errorHandler.isOperationalError(error)) {
        process.exit(1);
      }
    });
  }
}

const main = new Main();

export default main.app;
