import { json } from "body-parser";
import express from "express";
import { authRouter } from "./controllers/auth.controller";
import { currentUserRouter } from "./controllers/currentuser.controller";

const app = express();
app.use(json());

// routes
app.use(currentUserRouter);
app.use(authRouter);

app.listen(3001, () => {
  console.log("Listening on port 3001!");
});
