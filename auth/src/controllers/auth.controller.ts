import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request.err";
import { RequestValidationNodeError } from "../errors/request-validation-node.err";
import { User } from "../models/users";
import { validationUsers } from "../services/auth.const";
const router = express.Router();

router.post("/api/auth/signup", validationUsers, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationNodeError(errors.array());
  }
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) throw new BadRequestError("Username already in use");
  const newUser = User.build({ username, password });
  const createdUser = await newUser.save();
  res.send(createdUser);
});

router.post("/api/auth/login", validationUsers, (req: Request, res: Response) => {
  res.send("Hi there");
});

router.post("/api/auth/signout", (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

export { router as authRouter };
