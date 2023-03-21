import { Response } from "express";
import { IErrorsSend } from "../interfaces/function.interface";

export const sendError = ({ status: statusCode, errorMessage }: IErrorsSend, res: Response) => {
  return res.status(statusCode).json({ errors: errorMessage });
};
