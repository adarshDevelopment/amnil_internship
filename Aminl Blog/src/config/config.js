const dotenv = require('dotenv');
dotenv.config();

const AppConfig = {
  port : process.env.SERVER_PORT,
  jwtSecret: process.env.JWT_SECRET
}

const FrontendUrl = process.env.FRONTEND_URL;

const MongoDbConfig = {
  mongoDbUrl: process.env.MONGODB_URL,
  mongoDbLocal : process.env.MONGODB_LOCAL
}

const SmtpConfig = {
  provider: process.env.SMTP_PROVIDER,
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  port: process.env.SMTP_PORT,
  from: process.env.SMTP_FROM,
}

const CloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET
}

module.exports = {
  AppConfig,
  MongoDbConfig,
  SmtpConfig,
  FrontendUrl,
  CloudinaryConfig
}