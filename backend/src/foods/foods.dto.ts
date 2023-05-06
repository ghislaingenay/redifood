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

// SECTION //////////////
export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  @Length(3, 30)
  sectionName: string;

  // @IsString()
  // @Length(0, 50)
  // sectionDescription?: string;
}

export class UpdateSectionDto extends CreateSectionDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  sectionOrder: number;
}

// EXTRA ///////////////
export class CreateExtraDto {
  @IsNotEmpty()
  @Length(3, 30)
  @IsLowercase()
  @IsString()
  extraName: string;

  // @IsString()
  // @Length(0, 50)
  // extraDescription?: string;

  @IsInt()
  sectionId: number;
}

export class UpdateExtraDto extends CreateExtraDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  extraOrder: number;
}

// FOOD //////////////
export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  itemName: string;

  @IsString()
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
}

export class UpdateFoodDto extends CreateFoodDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
