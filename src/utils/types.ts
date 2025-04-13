interface IUser {
  firstName?: string;
  lastName?: string;
  email: string
  username: string;
  password: string;
  isMfaActive?: boolean;
  twoFactorSecret?: string;
}

export { IUser };
