import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ETopics } from 'redifood-module/src/interfaces';
import {
  PhotoCreatedEvent,
  PhotoUpdatedEvent,
} from '../redifood-module/src/events/picture/picture-class.event';
import { UploadService } from './upload.service';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @EventPattern(ETopics.PICTURE_CREATED)
  async handleCreatePhoto(data: PhotoCreatedEvent) {
    return await this.uploadService.handleCreatePhoto(data);
  }

  @EventPattern(ETopics.PICTURE_UPDATED)
  async handleUpdatePhoto(data: PhotoUpdatedEvent) {
    return await this.uploadService.handleUpdatePhoto(data);
  }

  // @EventPattern(ETopics.PICTURE_DELETED)
  // async handleDeletePhoto(data: PhotoDeletedEvent) {
  //   return await this.uploadService.handleDeletePhoto(data);
  // }
}
