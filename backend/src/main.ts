import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { urlencoded } from 'express';
// import * as session from 'express-session';
import * as cookieSession from 'cookie-session';
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

  // if (process.env.ENVIRONMENT === 'local') {
  //   app.enableCors({
  //     allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  //     origin: ['http://localhost:3001'],
  //     credentials: true,
  //   });
  // }

  app.use(
    // session({
    //   secret: process.env.SESSION_SECRET,
    //   resave: false,
    //   saveUninitialized: false,
    //   signed: false,
    //   cookie: {
    //     sameSite: 'lax',
    //     secure: false,
    //     // secure: process.env.NODE_ENV === 'production',
    //     maxAge: 200000000,
    //     httpOnly: true,
    //   },
    // }),
    cookieSession({
      signed: false,
      secure: false,
    }),
    cookieParser(),
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
    console.log('Connected to MongoDB');
    console.log('Listening on port 3000');
    await app.listen(3000);
  } catch (err) {
    console.log(err);
  }
}

bootstrap();
