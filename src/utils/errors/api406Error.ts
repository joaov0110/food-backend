import { HTTP } from '../../constants/http';
import { BaseError } from './baseError';

export class Api406Error extends BaseError {
  constructor(
    name = '',
    httpCode = HTTP.NOT_ACCEPTABLE,
    isOperational = true,
    description = 'Not Acceptable',
  ) {
    super(name, httpCode, isOperational, description);
  }
}
