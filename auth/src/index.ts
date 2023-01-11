import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { authRouter } from "./controllers/auth.controller";
import { currentUserRouter } from "./controllers/currentuser.controller";
import { NotFoundError } from "./errors/not-found.err";
import { errorHandler } from "./middlewares/error-handler.mdwr";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  }),
);

// routes
app.use(currentUserRouter);
app.use(authRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3002, () => {
  console.log("Listening on port 3002!");
});
