import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validationReturnal } from './validationReturnal';

const createPoint = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    tenant_id: Joi.number().required(),
    name: Joi.string().min(5).max(25).required(),
    email: Joi.string()
      .min(10)
      .max(50)
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'br', 'net'] } })
      .required(),
    phone: Joi.string().min(13).max(13).required(),
  });

  try {
    validationReturnal(schema, req.body);

    next();
  } catch (err: any) {
    return next(err);
  }
};

export default createPoint;
