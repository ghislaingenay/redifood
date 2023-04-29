import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { EStatusCodes } from 'redifood-module/src/interfaces';
import { IRequest } from 'src/handling/request';
import { User } from 'src/models/users.model';
import { signUpUserDto } from './auth.dto';
import { PasswordManager } from './password-manager';

@Injectable()
export class AuthService {
  req: IRequest;
  res: Response;
  constructor(req: IRequest, res: Response) {
    this.req = req;
    this.res = res;
  }
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
    this.req.session = { jwt: userJwt };
    return this.res.status(EStatusCodes.CREATED).send({
      message: 'Successfully created',
      data: createdUser,
      statusCode: EStatusCodes.CREATED,
    });
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
    this.req.session = { jwt: userJwt };
    return this.res.status(200).send(existingUser);
  }

  async signOutUser() {
    this.req.session = null;
    return this.res
      .status(HttpStatus.OK)
      .send({ message: 'Successfully signed out', statusCode: HttpStatus.OK });
  }

  async getCurrentUser(user: any) {
    const userInfo = user ? { currentUser: user } : { currentUser: null };
    return this.res.status(200).send(userInfo);
  }
}
