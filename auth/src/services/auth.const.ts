import { body } from "express-validator";

export const validationUsers = [
  body("username").isString().withMessage("username should be defined"),
  body("password")
    .trim()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%_*#?&]{8,20}/)
    .withMessage("password must contain at least one uppercase, one lowercase, one number and one special character"),
];
