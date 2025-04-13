import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser } from '../utils/types';

interface IUserMethods {
  comparePassword(password: string): boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isMfaActive: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.method('comparePassword', async function (password: string) {
  return bcrypt.compare(password, this.password);
});

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
