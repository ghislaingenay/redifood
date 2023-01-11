import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationNodeError } from "../errors/request-validation-node.err";
import { validationUsers } from "../services/auth.const";
const router = express.Router();

router.post("/api/auth/signup", validationUsers, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationNodeError(errors.array());
  }
  const { username, password } = req.body;
  console.log("Creating a user...", username, password);
  // if (!user) throw new DatabaseConnectionError()
  res.send({});
});

router.post("/api/auth/login", validationUsers, (req: Request, res: Response) => {
  res.send("Hi there");
});

router.post("/api/auth/signout", (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

export { router as authRouter };
