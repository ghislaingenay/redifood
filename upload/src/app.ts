/* eslint-disable @typescript-eslint/no-unused-vars */
import { json, urlencoded } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { EMessageErrors, EStatusCodes } from "../redifood-module/src/interfaces";
import { errorHandler } from "../redifood-module/src/middlewares/error-handler.mdwr";

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
// app.use(currentUserRouter);
// app.use(authRouter);
// app.use(settingsRouter);

app.all("*", async (req, res) => {
  res.status(EStatusCodes.NOT_FOUND).send({ message: EMessageErrors.NOT_FOUND, statusCode: EStatusCodes.NOT_FOUND });
});

app.use(errorHandler);

export { app };
