import { BadRequestException, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { User } from 'src/models/users.model';
import { signUpUserDto } from './auth.dto';
import { PasswordManager } from './password-manager';

@Injectable()
export class AuthService {
  async signUpUser(signUpDto: signUpUserDto) {
    const { email, password } = signUpDto;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Invalid credentials');
    }
    const newUser = User.build({ email, password });
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

  async signInUser(signInDto: signUpUserDto) {
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
}
