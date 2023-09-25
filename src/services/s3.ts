import config from 'config';
import AWS from 'aws-sdk';

export const S3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: config.get<string>('aws.region'),
});
