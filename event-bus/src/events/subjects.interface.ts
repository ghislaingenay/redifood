export enum ETopics {
  PICTURE_CREATED = 'picture:created',
  PICTURE_UPDATED = 'picture:updated',
  PICTURE_DELETED = 'picture:deleted',
}

export enum EMicroServices {
  PICTURE = 'picture',
}

export enum EGroupId {
  PICTURE = 'picture-group',
}

export interface IEvent<T> {
  topic: ETopics;
  data: T;
}
