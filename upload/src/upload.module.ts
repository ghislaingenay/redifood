import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
