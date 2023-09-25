require('dotenv').config();

module.exports = {
  port: 3005,
  url: 'http://localhost:5173',
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secreteAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    tenantProfilePicBucket: process.env.TENANT_PROFILE_PIC_BUCKET,
  },
};
