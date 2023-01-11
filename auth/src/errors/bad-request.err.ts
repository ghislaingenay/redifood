import { CustomError } from "./custom.err";
import { EStatusCodes } from "./err.interface";

export class BadRequestError extends CustomError {
  statusCode = EStatusCodes.BAD_REQUEST;
  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, status: this.statusCode }];
  }
}
