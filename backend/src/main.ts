import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieSession from 'cookie-session';
import { urlencoded } from 'express';
import mongoose from 'mongoose';
import { AppModule } from './app.module';
import { pool } from './pool.pg';
import { verifyKeys } from './verifykeys';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  verifyKeys();

  app.use(
    urlencoded({
      extended: true,
    }),
  );
  app.set('trust proxy', true);
  app.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test',
    }),
  );
  try {
    await pool.connect({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB_NAME,
      password: process.env.POSTGRES_PASSWORD,
      port: parseInt(process.env.POSTGRES_PORT),
    });

    await mongoose.connect(process.env.MONGO_URI);
    await app.listen(3000);
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
