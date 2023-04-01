import { IFoodDB } from 'redifood-module/src/interfaces';

export class PhotoCreatedEvent {
  constructor(
    public readonly item_id: IFoodDB['id'],
    public readonly photo_url: IFoodDB['item_photo'],
  ) {}

  toString(): string {
    return JSON.stringify({
      item_id: this.item_id,
      photo_url: this.photo_url,
    });
  }
}
export class PhotoUpdatedEvent {
  constructor(
    public readonly item_id: IFoodDB['id'],
    public readonly photo_url: IFoodDB['item_photo'],
  ) {}

  toString(): string {
    return JSON.stringify({
      item_id: this.item_id,
      photo_url: this.photo_url,
    });
  }
}
export class PhotoDeletedEvent {
  constructor(
    public readonly item_id: IFoodDB['id'],
    public readonly photo_url: IFoodDB['item_photo'],
  ) {}

  toString(): string {
    return JSON.stringify({
      item_id: this.item_id,
      photo_url: this.photo_url,
    });
  }
}
