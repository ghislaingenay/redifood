export enum EStatusCodes {
  SUCCESS = 200,
  CREATED = 201,
  VALIDATION_NODE = 400,
  DATABASE_CONNECTION = 500,
  BAD_REQUEST = 400,
  NOT_AUTHORIZED = 401,
  NOT_FOUND = 404,
}

export enum EMessageErrors {
  DATABASE_CONNECTION = "Database connection error",
  ALREADY_USERNAME = "Username already in use",
  INVALID_CREDENTIALS = "Invalid credentials",
  NOT_AUTHORIZED = "Not authorized",
  NOT_FOUND = "Not found",
  MISSING_ATTRIBUTES = "Missing attributes",
  EMPTY_ATTRIBUTES = "The body of the request is empty",
}

export enum EMessageSuccess {
  SETTINGS_RETRIEVED = "Settings successfully retrieved",
  SETTINGS_CREATED = "Settings successfully created",
  SETTINGS_UPDATED = "Settings successfully updated",
}
