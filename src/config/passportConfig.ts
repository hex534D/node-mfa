import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { User } from '../models/user.model';
import logger from '../logging/logger';

passport.use(
  new LocalStrategy(async function (
    username: string,
    password: string,
    done: any
  ) {
    try {
      const user = await User.findOne({ username });

      if (!user) return done(null, false, { message: 'User not found.' });

      const isMatch = await user.comparePassword(password);

      if (isMatch) return done(null, user);
      else return done(null, false, { message: 'Incorrect password.' });
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done: any) => {
  logger.info('Serializing the user.');
  done(null, user?._id);
});

passport.deserializeUser(async (_id: string, done) => {
  try {
     logger.info('deserializing the user.');
    const user = await User.findById({ _id });
    done(null, user);
  } catch (error) {
    done(error);
  }
})
