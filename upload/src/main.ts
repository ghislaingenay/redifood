import { NestFactory } from '@nestjs/core';
import cookieSession from 'cookie-session';
import { AuthGuard } from 'redifood-module/src/handling-nestjs/auth-guard';
import { AppModule } from './app.module';
import { pool } from './pool.pg';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  app.useGlobalGuards(new AuthGuard());
  app.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test',
    }),
  );
  await app.listen(3000);
}
bootstrap();
