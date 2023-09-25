import { Request } from 'express';

import multer from 'multer';
import { Api400Error } from '../utils/errors/api400Error';

const storage = multer.memoryStorage();

const maxFileSize = 2 * 1024 * 1024;

export const uploader = multer({
  storage: storage,
  limits: { fileSize: maxFileSize },
  fileFilter: (req: Request, file, cb) => {
    const allowerMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];

    const validFileFormat = allowerMimes.includes(file.mimetype);

    if (validFileFormat) {
      cb(null, true);
    } else {
      cb(new Api400Error(`Invalid file format`));
    }
  },
});
