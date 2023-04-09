import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieSession from 'cookie-session';
import { AppModule } from './app.module';
// import { AllExceptionsFilter } from './handling/catch-all.exception';
import { pool } from './pool.pg';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
  // app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  // app.useGlobalGuards(new AuthGuard());
  app.set('trust proxy', true);
  app.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test',
    }),
  );

  // Connection to microservices
  await app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 3000,
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
