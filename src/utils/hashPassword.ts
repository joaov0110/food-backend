import bcrypt from 'bcryptjs';

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  if (!hash) {
    console.error('Error hashing password');
    return null;
  }

  return hash;
};
