import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IGetServerSideData } from 'redifood-module/src/interfaces';
import { User } from '../models/users.model';
import { CheckEmailDto, signInUserDto, signUpUserDto } from './auth.dto';
import { PasswordManager } from './password-manager';

@Injectable()
export class AuthService {
  async signUpUser(signUpDto: signUpUserDto) {
    const { email, password, firstName, lastName } = signUpDto;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Invalid credentials');
    }
    const newUser = User.build({ email, password, firstName, lastName });
    const createdUser = await newUser.save();
    // Generate JWT
    const userJwt: string = jwt.sign(
      {
        id: createdUser.id,
        email: createdUser.email,
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_TOKEN!,
    );
    return [createdUser, userJwt];
  }

  async signInUser(signInDto: signInUserDto) {
    const { email, password } = signInDto;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestException('Invalid credentials');
    }
    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password,
    );
    if (!passwordsMatch) {
      throw new BadRequestException('Invalid credentials');
    }
    // Generate JWT
    const userJwt: string = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_TOKEN!,
    );
    return [existingUser, userJwt];
  }

  async checkEmail(
    checkEmailDto: CheckEmailDto,
  ): Promise<IGetServerSideData<{ canCreate: boolean }>> {
    try {
      const foundEmail = await User.findOne({ email: checkEmailDto.email });
      if (foundEmail) {
        return {
          results: { canCreate: false },
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'Please provide an other email or if an email is already registred in our system. PLease go to sign in page',
        };
      } else {
        return {
          results: { canCreate: true },
          statusCode: HttpStatus.OK,
          message: '',
        };
      }
    } catch (err) {
      return {
        results: { canCreate: false },
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          'Impossible to create your account. For more information, please contact redifood team',
      };
    }
  }
}
