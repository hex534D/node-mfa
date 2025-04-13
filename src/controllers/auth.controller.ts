import qrCode from 'qrcode';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

import logger from '../logging/logger';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { createError } from '../utils/custom-error';
import { error, success } from '../utils/response-handler';
import { JWT_SECRET } from '../constants';

const register = asyncHandler(async (req: any, res: any, next: any) => {
  const { firstName, email, lastName, username, password } = req.body;

  if (!username && !password)
    next(createError('All fields are required.', 400));

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) next(createError('Email or username already exists', 400));

  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    password,
  });

  const createdUser = await User.findById({ _id: user?._id }).select(
    '-password'
  );

  logger.info('User created.');

  res.status(201).json(success(201, 'User created successfully', createdUser));
});

const login = asyncHandler(async (req: any, res: any) => {
  logger.info(`User is authenticated:: `);
  res.status(200).json(
    success(200, 'User logged in successfully', {
      username: req.user?.username,
      isMfaActive: req.user?.isMfaActive,
    })
  );
});

const authStatus = async (req: any, res: any) => {
  if (req.user) {
    res.status(200).json(
      success(200, 'User logged in successfully', {
        username: req.user?.username,
        isMfaActive: req.user?.isMfaActive,
      })
    );
  } else {
    res.status(401).json(error(401, 'Unauthorized', ''));
  }
};

const logout = async (req: any, res: any) => {
  if (!req.user) return res.status(401).json(error(401, 'Unauthorized', ''));

  req.logout((err: any) => {
    if (err) return res.status(400).json(error(400, 'User not logged in', ''));
    res.status(200).json(success(200, 'Logout successful.'));
  });
};

const setup2FA = asyncHandler(async (req: any, res: any) => {
  const user = req.user;
  let secret = speakeasy.generateSecret();

  user.twoFactorSecret = secret.base32;
  user.isMfaActive = true;
  await user.save();

  // qrcode data url info
  const url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `${req.user?.username}`,
    issuer: 'hex534D.com',
    encoding: 'base32',
  });

  const qrCodeImage = await qrCode.toDataURL(url);

  res.status(200).json(
    success(200, 'MFA Setup successful.', {
      secret: secret.base32,
      qrCode: qrCodeImage,
    })
  );
});

const verify2FA = asyncHandler(async (req: any, res: any) => {
  const { token } = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user?.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    const jwtToken = jwt.sign(
      {
        username: user?.username,
      },
      JWT_SECRET,
      { expiresIn: '1hr' }
    );
    res
      .status(200)
      .json(success(200, '2FA verified successfully', { token: jwtToken }));
  } else {
    res.status(400).json(error(400, 'Invalid 2FA token'));
  }
});

const reset2FA = asyncHandler(async (req: any, res: any) => {
  const user = req.user;
  delete user.twoFactorSecret;
  user.isMfaActive = false;

  await user.save();

  res.status(200).json(success(200, '2FA reset successful'));
});

export { register, login, authStatus, logout, setup2FA, verify2FA, reset2FA };
