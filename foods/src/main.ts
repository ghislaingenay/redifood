import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './handling/catch-all.exception';
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
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  await app.listen(3000);
}
bootstrap();
