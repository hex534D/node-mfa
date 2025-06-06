import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import logger from './logging/logger';
import authRouter from './routes/auth.routes';
import healthCheckRouter from './routes/healthcheck.routes';
import errorHandler from './middlewares/error.middleware';
import { corsOptions, sessionOptions } from './constants';

// passport config
import './config/passportConfig';

const app = express();
const morganFormat = ':method :url :status :response-time ms';

// cors
app.use(cors(corsOptions));

// common express middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '16kb', extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// session middleware
app.use(session(sessionOptions));

// passport auth
app.use(passport.initialize());
app.use(passport.session());

// logging middleware
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// routes
app.use('/api/v1/healthcheck', healthCheckRouter);
app.use('/api/v1/auth', authRouter);

app.use(errorHandler);
export { app };
