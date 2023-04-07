import { IPhotoCreatedEvent } from 'redifood-module/src/events/picture/picture.event';
import { ETopics } from 'redifood-module/src/interfaces';
import { KafkaProducer } from '../../../../event-bus/redifood-module/src/events/ base-producer';

export class PhotoCreatedProducer extends KafkaProducer<IPhotoCreatedEvent> {
  topic: ETopics.PICTURE_CREATED = ETopics.PICTURE_CREATED;
}