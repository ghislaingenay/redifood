import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { RequestValidationNodeError } from "../errors/request-validation-node.err";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationNodeError(errors.array());
  }
  next();
};
