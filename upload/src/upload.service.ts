import { Injectable } from '@nestjs/common';
import { PhotoCreatedEvent } from 'redifood-module/src/events/picture/picture-class.event';

@Injectable()
export class UploadService {
  handleCreatePhoto(data: PhotoCreatedEvent) {
    console.log(`UPLOAD - Photo created`, data);
  }
}
