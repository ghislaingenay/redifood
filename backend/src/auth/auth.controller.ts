import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from '../../redifood-module/src/handling-nestjs/user-decorator';
import { IRequest } from '../../src/handling/request';
import { signInUserDto, signUpUserDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUpUser(
    @Body(new ValidationPipe()) signUpDto: signUpUserDto,
    @Req() req: IRequest,
    @Res() res: Response,
  ) {
    const [userData, userJwt] = await this.authService.signUpUser(signUpDto);
    req.session = { jwt: userJwt };
    return res.status(HttpStatus.CREATED).send({
      message: 'Successfully signed up',
      results: userData,
      statusCode: HttpStatus.CREATED,
    });
  }

  @Post('signin')
  async signInUser(
    @Body(new ValidationPipe()) signInDto: signInUserDto,
    @Req() req: IRequest,
    @Res() res: Response,
  ) {
    const [userData, userJwt] = await this.authService.signInUser(signInDto);
    req.session = { jwt: userJwt };
    return res.status(HttpStatus.CREATED).send({
      message: 'Successfully logged in',
      results: userData,
      statusCode: HttpStatus.CREATED,
    });
  }

  @Post('logout')
  logOutUser(@Req() req: IRequest, @Res() res: Response) {
    req.session = null;
    return res
      .status(HttpStatus.OK)
      .send({ message: 'Successfully signed out', statusCode: HttpStatus.OK });
  }

  @Get('currentuser')
  getCurrentUser(@User() user: any, @Res() res: Response) {
    const userInfo = user ? { currentUser: user } : { currentUser: null };
    return res.status(HttpStatus.OK).send(userInfo);
  }
}
