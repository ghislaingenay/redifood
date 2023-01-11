import { CustomError } from "./custom.err";
import { EStatusCodes } from "./err.interface";

export class DatabaseConnectionError extends CustomError {
  statusCode = EStatusCodes.DATABASE_CONNECTION;
  errorMessage = "Error connecting to database";

  constructor() {
    super("Error database connection");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.errorMessage,
        status: this.statusCode,
      },
    ];
  }
}
