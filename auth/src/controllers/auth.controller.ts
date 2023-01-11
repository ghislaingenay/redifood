import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request.err";
import { validateRequest } from "../middlewares/validationrequestnode.mdwr";
import { User } from "../models/users";
import { validationUsers } from "../services/auth.const";
import { PasswordManager } from "../services/password-manager";
const router = express.Router();

router.post("/api/auth/signup", validationUsers, validateRequest, async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) throw new BadRequestError("Username already in use");
  const newUser = User.build({ username, password });
  const createdUser = await newUser.save();

  // Generate JWT
  const userJwt: string = jwt.sign(
    {
      id: createdUser.id,
      username: createdUser.username,
    },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.JWT_TOKEN!,
  );
  req.session = { jwt: userJwt };
  res.status(201).send(createdUser);
});

router.post("/api/auth/login", validationUsers, validateRequest, async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (!existingUser) throw new BadRequestError("Invalid credentials");
  const passwordsMatch = await PasswordManager.compare(existingUser.password, password);
  if (!passwordsMatch) throw new BadRequestError("Invalid credentials");
  // Generate JWT
  const userJwt: string = jwt.sign(
    {
      id: existingUser.id,
      username: existingUser.username,
    },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.JWT_TOKEN!,
  );
  req.session = { jwt: userJwt };
  res.status(200).send(existingUser);
});

router.post("/api/auth/signout", (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

export { router as authRouter };
