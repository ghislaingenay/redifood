import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
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
  @Length(3, 30)
  sectionName: string;

  @IsString()
  @Length(0, 50)
  sectionDescription?: string;
}

export class ExtraApiDto {
  @IsNotEmpty()
  @Length(3, 30)
  @IsString()
  extraName: string;

  @IsString()
  @Length(0, 50)
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
  itemSection: number;

  @IsInt()
  @IsNotEmpty()
  itemExtra: number;

  @IsDate()
  @IsNotEmpty()
  itemCreated: Date;

  @IsInt()
  @IsNotEmpty()
  itemQuantity: number;
}
