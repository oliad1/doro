import { NextFunction, Request, Response } from "express";
import AuthService from "../services/implementations/authService";

const authService = new AuthService();

const getJWTHeader = (req: Request): string | null => {
  return req.headers.authorization?.split("Bearer ")[1] || null;
};

const authFactory = (fn: (jwt: string) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const jwt = getJWTHeader(req);
    if (!jwt) {
      return res.status(401).json({ error: "You are not authorized to make this request." });
    }

    const authorized = await fn(jwt);
    if (!authorized) {
      return res.status(403).json({ error: "You do not have permission to make this request" });
    }

    return next();
  };
};

export const isAuthorizedByExistence = () => {
  return authFactory((jwt) =>
    authService.isAuthorizedByExistence(jwt)
  ); 
};
