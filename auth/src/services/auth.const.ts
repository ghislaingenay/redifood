import { body } from "express-validator";

export const validationUsers = [
  body("email").isEmail().withMessage("email should be defined"),
  body("password")
    .trim()
    .matches(/^(?=.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).*$/)
    .withMessage("password must contain at least one uppercase, one lowercase, one number and one special character"),
];
