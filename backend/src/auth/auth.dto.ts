import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class signUpUserDto {
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

export class signInUserDto extends signUpUserDto {}
