import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { ELanguage } from 'redifood-module/src/interfaces';

export class ForgetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(ELanguage)
  @IsNotEmpty()
  lang: ELanguage;
}

export class ValidateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6)
  code: string;
}
