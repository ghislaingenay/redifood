/* eslint-disable @typescript-eslint/no-unused-vars */
import { json, urlencoded } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { authRouter } from "./controllers/auth.controller";
import { currentUserRouter } from "./controllers/currentuser.controller";
import { NotFoundError } from "./errors/not-found.err";
import { errorHandler } from "./middlewares/error-handler.mdwr";

const app = express();

app.use(
  urlencoded({
    extended: true,
  }),
);
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  }),
);

// routes
app.use(currentUserRouter);
app.use(authRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
