import { HTTP } from '../../constants/http';
import { BaseError } from './baseError';

export class Api500Error extends BaseError {
  constructor(
    name = '',
    httpCode = HTTP.INTERNAL,
    isOperational = true,
    description = 'Internal server error',
  ) {
    super(name, httpCode, isOperational, description);
  }
}
