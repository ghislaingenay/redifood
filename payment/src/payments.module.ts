import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EGroupId } from '../redifood-module/src/interfaces';
import { PaymentController } from './payments.controller';
import { PaymentService } from './payments.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: EGroupId.UPLOAD,
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
