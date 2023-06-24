import { NextFunction, Response, Request } from 'express';
import { BaseError } from './baseError';

class ErrorHandler {
  public logError = (err: Error) => {
    console.error('\n############', err);
  };

  public logErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    this.logError(err);
    next(err);
  };

  public returnError = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    res.status(error.httpCode || 500).send(error.name);
  };

  public isOperationalError = (error: Error) => {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  };
}

const errorHandler = new ErrorHandler();
export default errorHandler;
