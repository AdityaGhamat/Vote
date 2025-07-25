import dotenv from "dotenv";
dotenv.config();
export default {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  TWILO_SERVICE_SID: process.env.TWILO_SERVICE_SID,
  TWILO_ACCOUNT_SID: process.env.TWILO_ACCOUNT_SID,
  TWILO_AUTH_TOKEN: process.env.TWILO_AUTH_TOKEN,
  TWILO_PHONE_NUMBER: process.env.TWILO_PHONE_NUMBER,
};
