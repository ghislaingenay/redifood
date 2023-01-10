import { json } from "body-parser";
import express from "express";

const app = express();
app.use(json());

// routes
app.listen(3001, () => {
  console.log("Listening on port 3001!");
});
