import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PhotoCreatedEvent } from 'redifood-module/src/events/picture/picture-class.event';
import { ETopics } from 'redifood-module/src/interfaces';
import { UploadService } from './upload.service';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @EventPattern(ETopics.PICTURE_CREATED)
  async handleCreatePhoto(data: PhotoCreatedEvent) {
    return await this.uploadService.handleCreatePhoto(data);
  }
}
