// Able to carry class over using class (similar to interface)

import { EStatusCodes } from "../../redifood-module/src/interfaces";

// abstract
// Can't be instantiated directly (new CustomError())
// 1 - Used to set up requirements for subclasses
// 2 - Can use instanceof to check if an object is an instance of a class
export abstract class CustomError extends Error {
  abstract statusCode: EStatusCodes;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
