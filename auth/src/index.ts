import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_TOKEN) {
    throw new Error("JWT_TOKEN must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console;
  }
};

start();
app.listen(3002, () => {
  console.log("Listening on port 3002!");
});
