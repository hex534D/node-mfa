const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRY = process.env.JWT_EXPIRY || ' ';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '';
const DB_NAME = process.env.DB_NAME || 'node-mfa';
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || ' ';

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

const corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
};

const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000 * 60
  }
};

export {
  PORT,
  DB_NAME,
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  options,
  corsOptions,
  sessionOptions
};
