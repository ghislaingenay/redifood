import * as dotenv from "dotenv";
import { pool } from "../redifood-module/src/definitions/pool.pg";
import { kafkaClient } from "../redifood-module/src/events/kafka-client";
import { app } from "./app";
import { PhotoCreatedConsumer } from "./events/photo-created-consumer";
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

    await kafkaClient.connect("localhost:9092");

    // Initialize the consumer service
    new PhotoCreatedConsumer(kafkaClient).listen();

    app.listen(3000, () => {
      console.log("Listening on port 3000!");
    });
  } catch (err) {
    console.log(err);
  }
};

start();
