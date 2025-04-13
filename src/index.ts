import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { PORT } from './constants'
import logger from './logging/logger';
import databaseConnection from './db/connection';

app.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}...`);
  try {
    await databaseConnection();
  } catch (error) {
    logger.error('Error in connecting to MongoDB', error);
  }
});
