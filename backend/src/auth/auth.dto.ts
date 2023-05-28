import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class signInUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 20)
  @Matches(
    /^(?=.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).*$/,
    {
      message:
        'password must contain at least one uppercase, one lowercase, one number and one special character',
    },
  )
  password: string;
}

export class signUpUserDto extends signInUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class CheckEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
