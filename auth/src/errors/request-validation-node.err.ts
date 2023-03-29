import { ValidationError } from "express-validator";
import { EStatusCodes } from "../../redifood-module/src/interfaces";
import { CustomError } from "./custom.err";
export class RequestValidationNodeError extends CustomError {
  statusCode = EStatusCodes.VALIDATION_NODE;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationNodeError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
