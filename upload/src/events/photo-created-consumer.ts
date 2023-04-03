import { EGroupId, ETopics } from "redifood-module/src/events/subjects.interface";
import { KafkaConsumer } from "../../../event-bus/redifood-module/src/events/base-consumer";
import { IPhotoCreatedEvent } from "../../../event-bus/redifood-module/src/events/picture/picture.event";

export class PhotoCreatedConsumer extends KafkaConsumer<IPhotoCreatedEvent> {
  topic: ETopics.PICTURE_CREATED = ETopics.PICTURE_CREATED;
  groupId: EGroupId.PICTURE;
  onMessage;
}
