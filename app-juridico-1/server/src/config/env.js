const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || 'your_database_connection_string',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '10485760', // 10MB
};