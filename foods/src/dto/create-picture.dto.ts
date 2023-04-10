import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IFoodDB } from '../../redifood-module/src/interfaces';

export class CreatePictureDto {
  @IsNotEmpty()
  @IsInt()
  item_id: IFoodDB['id'];

  @IsNotEmpty()
  @IsString()
  photo_url: IFoodDB['item_photo'];
}
