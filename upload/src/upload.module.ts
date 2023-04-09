import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { EGroupId } from 'redifood-module/src/interfaces';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ClientsModule.register([
    //   {
    //     name: EGroupId.FOOD,
    //     transport: Transport.TCP,
    //   },
    // ]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
