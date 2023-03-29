import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { pool } from "../redifood-module/src/definitions/pool.pg";
import { app } from "./app";
dotenv.config();
const start = async () => {
  if (!process.env.JWT_TOKEN) {
    throw new Error("JWT_TOKEN must be defined");
  }

  try {
    await pool
      .connect({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB_NAME,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.POSTGRES_PORT!),
      })
      .catch((err: Error) => {
        console.log(err);
      });
    console.log("Postgres connected");
    app.listen(3000, () => {
      console.log("Listening on port 3000!");
    });
  } catch (err) {
    console.error(err);
  }
};

start();
