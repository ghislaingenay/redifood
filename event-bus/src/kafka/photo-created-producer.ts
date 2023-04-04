import { PhotoCreatedEvent } from 'redifood-module/src/events/picture/picture-class.event';
import { ETopics } from 'redifood-module/src/interfaces';
import { KafkaProducer } from './ base-producer';

export class PhotoCreatedProducer extends KafkaProducer<PhotoCreatedEvent> {
  topic: ETopics.PICTURE_CREATED = ETopics.PICTURE_CREATED;
}
