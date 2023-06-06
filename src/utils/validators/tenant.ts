import { checkSchema, Schema } from 'express-validator';

export const tenantSchema: Schema = {
  name: {
    errorMessage: '"name" invalid',
    isLength: {
      options: { min: 2, max: 25 },
    },
  },
  document: {
    errorMessage: '"document" invalid',
    isLength: {
      options: { min: 14, max: 16 },
    },
  },
  email: {
    errorMessage: '"email" invalid',
    isEmail: true,
    isLength: {
      options: { min: 10, max: 50 },
    },
  },
  password: {
    errorMessage: '"password" invalid',
    isLength: {
      options: { min: 10, max: 255 },
    },
  },
  accountant_name: {
    errorMessage: '"accountant name" invalid',
    isLength: {
      options: { min: 2, max: 20 },
    },
  },
  accountant_email: {
    errorMessage: '"accountant email" invalid',
    isEmail: true,
    isLength: {
      options: { min: 2, max: 50 },
    },
  },
  accountant_phone: {
    errorMessage: '"accountant phone" invalid',
    isLength: {
      options: { min: 15, max: 20 },
    },
  },
};
