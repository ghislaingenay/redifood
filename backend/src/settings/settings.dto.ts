import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ECurrency, ELanguage } from '../../redifood-module/src/interfaces';

export class CreateSettingsDto {
  @IsEnum(ECurrency)
  @IsNotEmpty()
  currency: ECurrency;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  vat: number;

  @IsNotEmpty()
  @IsEnum(ELanguage)
  language: ELanguage;

  @IsNotEmpty()
  @IsBoolean()
  haveFoodImage: boolean;
}

export class UpdateSettingsDto extends CreateSettingsDto {
  @IsNotEmpty()
  @IsString()
  _id: string;
}
