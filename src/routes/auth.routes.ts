import { Router } from 'express';
import passport from 'passport';
import {
  register,
  login,
  authStatus,
  logout,
  setup2FA,
  reset2FA,
  verify2FA,
} from '../controllers/auth.controller';
import { isUserAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// auth routes
router.post('/register', register);
router.post('/login', passport.authenticate('local'), login);
router.get('/status', authStatus);
router.post('/logout', logout);

// 2fa routes
router.post('/2fa/setup', isUserAuthenticated, setup2FA);
router.post('/2fa/verify', isUserAuthenticated, verify2FA);
router.post('/2fa/reset', isUserAuthenticated, reset2FA);

export default router;
