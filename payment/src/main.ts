import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieSession from 'cookie-session';
import { PaymentModule } from './payments.module';
import { pool } from './pool.pg';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(PaymentModule);
  await pool
    .connect({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB_NAME,
      password: process.env.POSTGRES_PASSWORD,
      port: parseInt(process.env.POSTGRES_PORT),
    })
    .catch((err: Error) => {
      console.log(err);
    });
  console.log('Postgres connected');
  console.log('Listening on port 3000');
  app.set('trust proxy', true);
  app.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test',
    }),
  );
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 3000,
    },
  });
  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
