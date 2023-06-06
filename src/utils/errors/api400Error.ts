import { HTTP } from '../../constants/http';
import { BaseError } from './baseError';

export class Api400Error extends BaseError {
  constructor(
    name = '',
    httpCode = HTTP.BAD_REQUEST,
    isOperational = true,
    description = 'Bad request',
  ) {
    super(name, httpCode, isOperational, description);
  }
}
