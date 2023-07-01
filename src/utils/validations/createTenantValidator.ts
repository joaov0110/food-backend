import { Request, Response, NextFunction } from 'express';
import Joi, { valid } from 'joi';
import { validationReturnal } from './validationReturnal';
import DocumentValidator from './documentValidator';

const createTenant = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(25).required(),
    document: Joi.string()
      .min(14)
      .max(14)
      .required()
      .custom((value, helper) => {
        const validateDoc = DocumentValidator.validateDocument(value);
        return !validateDoc ? helper.error('any.invalid') : true;
      })
      .messages({
        'any.invalid': 'Document is invalid',
      }),

    email: Joi.string()
      .min(10)
      .max(50)
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'br', 'net'] } })
      .required(),
    password: Joi.string().min(10).max(255).required(),
    accountant_name: Joi.string().min(5).max(20).required(),
    accountant_email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'br', 'net'] },
      })
      .min(5)
      .max(20)
      .required(),
    accountant_phone: Joi.string().min(13).max(13).required(),
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

export default createTenant;
