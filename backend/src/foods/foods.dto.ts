import {
  IsInt,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class SectionApiDto {
  // id: number

  // @IsInt()
  // @IsNotEmpty()
  // @IsPositive()
  // section_order: number;

  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  @Length(3, 30)
  sectionName: string;

  // @IsString()
  // @Length(0, 50)
  sectionDescription?: string;
}

export class ExtraApiDto {
  @IsNotEmpty()
  @Length(3, 30)
  @IsLowercase()
  @IsString()
  extraName: string;

  // @IsString()
  extraDescription?: string;

  @IsInt()
  sectionId: number;
}

export class FoodApiDto {
  id?: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  itemName: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  itemPhoto: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  itemPrice: number;

  @IsString()
  @Length(0, 50)
  itemDescription: string;

  @IsInt()
  @IsNotEmpty()
  sectionId: number;

  @IsInt()
  @IsNotEmpty()
  extraId: number;

  itemCreated?: Date;

  @IsInt()
  @IsNotEmpty()
  itemQuantity: number;
}
