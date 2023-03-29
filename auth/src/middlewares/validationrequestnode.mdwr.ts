import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { EStatusCodes } from "../../redifood-module/src/interfaces";

import { RequestValidationNodeError } from "../errors/request-validation-node.err";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(EStatusCodes.VALIDATION_NODE).send({
      errors: errors.array().map((err) => {
        return { message: err.msg, field: err.param };
      }),
    });
    throw new RequestValidationNodeError(errors.array());
  }
  next();
};
