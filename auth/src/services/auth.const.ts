import { body } from "express-validator";

export const validationUsers = [
  body("username")
    .isString()
    .matches(/^[a-zA-Z0-9._-]{4,12}$/)
    .withMessage("username should be defineda and have between 4 and 12 characters"),
  body("password")
    .trim()
    .matches(/^(?=.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).*$/)
    .withMessage("password must contain at least one uppercase, one lowercase, one number and one special character"),
];

// regex that check a password between 8 and 20 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
// /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/
// /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])(?=.{8,20}).*$/
