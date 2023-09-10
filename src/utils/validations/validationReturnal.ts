import Joi from 'joi';
import { Api400Error } from '../errors/api400Error';

const errorMessage = (error: Joi.ValidationError) => {
  return error?.details[0].message;
};

export const validationReturnal = (
  schema: Joi.ObjectSchema,
  valuesToCheck: any,
) => {
  const { error } = schema.validate(valuesToCheck);

  if (error) {
    throw new Api400Error(errorMessage(error));
  }
};
