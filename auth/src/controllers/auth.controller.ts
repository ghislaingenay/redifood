import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

router.post(
  "/api/auth/signup",
  [
    body("username").isString().withMessage("username should be defined"),
    body("password")
      .trim()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d!@#$%^()&*_]{8,20}$/)
      .withMessage(
        "password must contain at least one uppercase, one lowercase, one number, one special character and must be between 8 and 20 characters long",
      ),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const { username, password } = req.body;
    console.log("Creating a user...", username, password);
    res.send({});
  },
);

router.post("/api/auth/login", (req: Request, res: Response) => {
  res.send("Hi there");
});

router.post("/api/auth/signout", (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

export { router as authRouter };
