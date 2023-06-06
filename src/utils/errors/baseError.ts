import { HTTP } from '../../constants/http';

export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HTTP;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HTTP,
    isOperational: boolean,
    description: string,
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
