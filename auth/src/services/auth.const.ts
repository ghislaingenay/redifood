import { body } from "express-validator";

export const validationUsers = [
  body("username").isString().not().isEmpty().withMessage("username should be defined"),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
    .withMessage("password must contain at least one uppercase, one lowercase, one number and one special character"),
];
