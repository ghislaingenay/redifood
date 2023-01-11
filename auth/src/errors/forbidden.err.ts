import { CustomError } from "./custom.err";
import { EStatusCodes } from "./err.interface";

export class NotAuthorizedError extends CustomError {
  statusCode = EStatusCodes.NOT_AUTHORIZED;

  constructor() {
    super("Not authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [
      {
        status: this.statusCode,
        message: "Not authorized",
      },
    ];
  }
}
