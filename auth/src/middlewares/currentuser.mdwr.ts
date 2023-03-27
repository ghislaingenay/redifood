import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  username: string;
}

declare global {
  // Reach into a existing type definition
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // Find the interface of Request inside Express and add new parameters
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// Middleware that extract the JWT payload and set it on 'req.currentUser'
export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  console.log("req.val", req.headers?.cookie);
  console.log("req.session", req.session?.jwt);
  if (!req.session?.jwt) {
    return next();
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const payload = jwt.verify(req.session.jwt, process.env.JWT_TOKEN!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    /* empty */
  }

  next();
};
