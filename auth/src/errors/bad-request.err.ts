import { CustomError } from "./custom.err";
import { EStatusCodes } from "./err.interface";

export class BadRequestError extends CustomError {
  statusCode = EStatusCodes.BAD_REQUEST;
  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }];
  }
}
