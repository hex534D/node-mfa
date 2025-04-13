import { error } from "../utils/response-handler";

export const isUserAuthenticated = (req: any, res: any, next: any) => {
  if (req?.isAuthenticated()) return next();
  res.status(401).json(error(401, 'Unauthorized'));
}