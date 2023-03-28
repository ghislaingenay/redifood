import { EStatusCodes } from "../../redifood-module/src/interfaces";
import { CustomError } from "./custom.err";

export class NotFoundError extends CustomError {
  statusCode = EStatusCodes.NOT_FOUND;
  constructor() {
    super("Route not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Found" }];
  }
}
