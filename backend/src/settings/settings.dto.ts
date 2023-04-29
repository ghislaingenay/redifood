import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ECurrency, ELanguage } from '../../redifood-module/src/interfaces';

export class createSettingsDto {
  @IsEnum(ECurrency)
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  vat: number;

  @IsNotEmpty()
  @IsEnum(ELanguage)
  language: string;

  @IsNotEmpty()
  @IsBoolean()
  haveFoodDescription: boolean;

  @IsNotEmpty()
  @IsBoolean()
  haveFoodImage: boolean;
}

export class updateSettingsDto extends createSettingsDto {}
