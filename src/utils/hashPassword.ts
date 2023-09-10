import bcrypt from 'bcryptjs';
import { Api406Error } from './errors/api406Error';

export class PasswordHash {
  private static genereateSalt() {
    return bcrypt.genSaltSync(12);
  }

  public static hashPassword(password: string) {
    const salt = this.genereateSalt();
    const hash = bcrypt.hashSync(password, salt);

    if (!hash) {
      throw new Api406Error('An error has ocurred. Please try again later');
    }

    return hash;
  }
}
