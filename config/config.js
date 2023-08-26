require('dotenv').config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';
CONFIG.host = process.env.HOST || 'http://localhost';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'CoCo';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || '123456';
// CONFIG.timezone = process.env.TIMEZONE || '+07:00';

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000';
CONFIG.jwt_expires_in = process.env.JWT_EXPIRES_IN || '30d';
CONFIG.jwt_secret = process.env.JWT_SECRET || 'CoCo2021';

// CONFIG SESSION ID FOR END USER MESSAGE
CONFIG.jwt_secret_session = process.env.JWT_SECRET_SESSION || 'SessionForEndUser';
CONFIG.jwt_secret_session_expires_in = process.env.JWT_SECRET_SESSION_EXPIRES_IN || '1d';

CONFIG.host_ui = process.env.HOST_UI || 'http://localhost:3002';

CONFIG.swipe_number = process.env.SWIPE_NUMBER || 10;

CONFIG.facebook_app_id = process.env.FACEBOOK_APP_ID;
CONFIG.facebook_app_secret = process.env.FACEBOOK_APP_SECRET;
CONFIG.google_client_id = process.env.GOOGLE_CLIENT_ID;
CONFIG.google_client_secret = process.env.GOOGLE_CLIENT_SECRET;

module.exports = CONFIG;
