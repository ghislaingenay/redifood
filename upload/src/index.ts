import * as dotenv from "dotenv";
import { pool } from "../redifood-module/src/definitions/pool.pg";
import { EGroupId, ETopics } from "../redifood-module/src/events/subjects.interface";
import { KafkajsConsumer } from "../redifood-module/src/kafka/kafka.consumer";
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

    // Initialize the consumer service
    const consumer = new KafkajsConsumer(
      [ETopics.PICTURE_CREATED, ETopics.PICTURE_DELETED, ETopics.PICTURE_UPDATED],
      { groupId: EGroupId.UPLOAD as string },
      "localhost:9092",
    );

    // Start the consumer service
    await consumer.connect();
    await consumer.consume(async (message) => {
      console.log(message);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
