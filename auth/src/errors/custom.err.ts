// Able to carry class over using class (similar to interface)

// abstract
// Can't be instantiated directly (new CustomError())
// 1 - Used to set up requirements for subclasses
// 2 - Can use instanceof to check if an object is an instance of a class
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; status: number; field?: string }[];
}
