import { Result, ValidationError, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validatorsReturnal = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: Result = validationResult(req);
  const errorMessages: ValidationError[] = errors.array();

  if (errorMessages.length) {
    return res.status(400).json({
      errors: errorMessages.map((error) => error.msg),
    });
  }

  return next();
};
