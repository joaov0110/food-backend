import {
  DeleteObjectRequest,
  PutObjectAclRequest,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import { S3 } from '../services/s3';
import { Api500Error } from './errors/api500Error';

interface IuploadFile {
  bucketName: string;
  fileName: string;
  fileContent: Buffer;
}

interface IlistObjects {
  filter: string;
  bucket: string;
}

interface IdeleteFile {
  bucket: string;
  fileName: string;
}

interface IrollbackUpload {
  bucket: string;
  filter: string;
}

abstract class S3Actions {
  static uploadFile = async (payload: IuploadFile) => {
    const { bucketName, fileName, fileContent } = payload;

    console.log(payload);
    const params: PutObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ACL: 'public-read',
    };

    const result = await S3.upload(params).promise();

    if (!result) {
      throw new Api500Error('Error uploading profile image');
    }

    return result.Location;
  };

  static listObjects = async (payload: IlistObjects) => {
    const { filter, bucket } = payload;

    const params = {
      Bucket: bucket,
      Prefix: decodeURIComponent(filter),
    };

    const result = await S3.listObjectsV2(params).promise();
    const resultLastItem = result.Contents ? result.Contents.length : null;

    if (!resultLastItem) {
      return null;
    }

    return result.Contents?.map((item) => item.Key)[resultLastItem];
  };

  static deleteFile = async (payload: IdeleteFile) => {
    const { fileName, bucket } = payload;

    const params: DeleteObjectRequest = {
      Key: fileName,
      Bucket: bucket,
    };

    const result = await S3.deleteObject(params).promise();
    if (!result) {
      throw new Api500Error('Error deleting image');
    }

    return result;
  };

  static rollBackUpload = async (data: IrollbackUpload) => {
    const { bucket, filter } = data;

    try {
      const savedImage = await this.listObjects({
        bucket: bucket,
        filter: filter,
      });

      if (savedImage) {
        try {
          await this.deleteFile({
            bucket: bucket,
            fileName: savedImage,
          });
        } catch (err) {
          throw new Error(
            'Error rolling back upload to aws. Check the file on the bucket and mannualy delete it.',
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export default S3Actions;
