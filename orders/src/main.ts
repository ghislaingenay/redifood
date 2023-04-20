import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  if (!process.env.MONGO_URI_ORDERS) {
    throw new Error('MONGO_URI_ORDERS must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
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
