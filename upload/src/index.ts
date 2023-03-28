import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { app } from "./app";
dotenv.config();
const start = async () => {
  if (!process.env.JWT_TOKEN) {
    throw new Error("JWT_TOKEN must be defined");
  }

  // try {
  //   await mongoose.connect(process.env.MONGO_URI);
  //   console.log("Connected to MongoDB");
  // } catch (err) {
  //   console.error(err);
  // }
};

start();
app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
