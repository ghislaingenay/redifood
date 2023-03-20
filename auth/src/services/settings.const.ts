import { body } from "express-validator";

export const validateSettings = [
  body("userId").isString().withMessage("userId should be defined"),
  body("currency").isString().withMessage("currency should be defined"),
  body("vat").isNumeric().withMessage("vat should be defined"),
  body("language").isString().withMessage("language should be defined"),
  body("haveFoodDescription").isBoolean().withMessage("haveFoodDescription should be defined"),
  body("haveFoodImage").isBoolean().withMessage("haveFoodImage should be defined"),
];
