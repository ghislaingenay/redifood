import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { EMessageErrors, EStatusCodes } from "../../redifood-module/src/interfaces";
import { BadRequestError } from "../errors/bad-request.err";
import { validateRequest } from "../middlewares/validationrequestnode.mdwr";
import { User } from "../models/users.model";
import { validationUsers } from "../services/auth.const";
import { PasswordManager } from "../services/password-manager";

const router = express.Router();

router.post("/api/auth/signup", validationUsers, validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(EStatusCodes.BAD_REQUEST).send({ errors: [{ message: EMessageErrors.ALREADY_USERNAME }] });
    throw new BadRequestError("Username already in use");
  }
  const newUser = User.build({ email, password });
  const createdUser = await newUser.save();

  // Generate JWT
  const userJwt: string = jwt.sign(
    {
      id: createdUser.id,
      email: createdUser.email,
    },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.JWT_TOKEN!,
  );
  req.session = { jwt: userJwt };
  res.status(201).send(createdUser);
});

router.post("/api/auth/login", validationUsers, validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res.status(EStatusCodes.BAD_REQUEST).send({ errors: [{ message: EMessageErrors.INVALID_CREDENTIALS }] });
    throw new BadRequestError("Invalid credentials");
  }
  const passwordsMatch = await PasswordManager.compare(existingUser.password, password);
  if (!passwordsMatch) {
    res.status(EStatusCodes.BAD_REQUEST).send({ errors: [{ message: EMessageErrors.INVALID_CREDENTIALS }] });
    throw new BadRequestError("Invalid credentials");
  }
  // Generate JWT
  const userJwt: string = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
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
