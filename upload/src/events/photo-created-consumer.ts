import { Message } from "kafkajs";
import { KafkaConsumer } from "../../redifood-module/src/events/base-consumer";
import { IPhotoCreatedEvent } from "../../redifood-module/src/events/picture/picture.event";
import { EGroupId, ETopics } from "../../redifood-module/src/events/subjects.interface";
// import Upload from "../upload.postgres";

export class PhotoCreatedConsumer extends KafkaConsumer<IPhotoCreatedEvent> {
  topic: ETopics.PICTURE_CREATED = ETopics.PICTURE_CREATED;
  groupId: EGroupId.PICTURE;
  async onMessage(data: IPhotoCreatedEvent["data"], msg: Message) {
    // const query =
    // await Upload.createUpload;
  }
}
