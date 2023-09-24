import { Request } from 'express';

import multer from 'multer';
import { Api400Error } from '../utils/errors/api400Error';

const storage = multer.memoryStorage();

export const uploader = multer({
  storage: storage,
  fileFilter: (req: Request, file, cb) => {
    const allowerMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];

    if (allowerMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Api400Error('Invalid file type'));
    }
  },
});
