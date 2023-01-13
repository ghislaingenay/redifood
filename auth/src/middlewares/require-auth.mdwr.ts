import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/forbidden.err";
import { EMessageErrors, EStatusCodes } from "../interfaces/err.interface";

// Middleware that reject the request if the user is not logged in
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Assume that requireAuth is use after the currentuser middleware
  if (!req.currentUser) {
    res.status(EStatusCodes.NOT_AUTHORIZED).send({
      errors: [
        {
          message: EMessageErrors.NOT_AUTHORIZED,
        },
      ],
    });
    throw new NotAuthorizedError();
  }
  next();
};
