import { json } from "body-parser";
import express from "express";
import "express-async-errors";
import { authRouter } from "./controllers/auth.controller";
import { currentUserRouter } from "./controllers/currentuser.controller";
import { errorHandler } from "./middlewares/error-handler.mdwr";

const app = express();
app.use(json());

// routes
app.use(currentUserRouter);
app.use(authRouter);

app.all("*", async () => {
  throw new Error("Route not found");
});

app.use(errorHandler);

app.listen(3001, () => {
  console.log("Listening on port 3001!");
});
