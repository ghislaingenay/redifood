import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { EStatusCodes } from 'redifood-module/src/interfaces';
import { IRequest } from 'src/handling/request';
import { User } from 'src/models/users.model';
import { signUpUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  req: IRequest;
  res: Response;
  constructor(req, res) {
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
}
