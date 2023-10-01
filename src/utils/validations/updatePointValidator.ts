import { Request, Response, NextFunction } from 'express';
import Joi, { valid } from 'joi';
import { validationReturnal } from './validationReturnal';

const updatePoint = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    point_id: Joi.string().required(),
    name: Joi.string().min(5).max(25).required(),
    email: Joi.string()
      .min(10)
      .max(50)
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'br', 'net'] } })
      .required(),
    phone: Joi.string().min(13).max(13).required(),
    address: Joi.object()
      .keys({
        postalCode: Joi.string().min(8).max(8).required(),
        street: Joi.string().min(2).max(25).required(),
        street_number: Joi.string().min(1).max(5).required(),
        district: Joi.string().min(2).max(20).required(),
        city: Joi.string().min(2).max(10).required(),
        UF: Joi.string().min(2).max(2).required(),
      })
      .required(),
  });

  try {
    validationReturnal(schema, req.body);

    next();
  } catch (err) {
    return next(err);
  }
};

export default updatePoint;
