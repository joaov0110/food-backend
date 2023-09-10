import { HTTP } from '../../constants/http';
import { BaseError } from './baseError';

export class Api404Error extends BaseError {
  constructor(
    name = '',
    httpCode = HTTP.NOT_FOUND,
    isOperational = true,
    description = 'Not found',
  ) {
    super(name, httpCode, isOperational, description);
  }
}
