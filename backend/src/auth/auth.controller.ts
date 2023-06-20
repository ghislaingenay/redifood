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
import { IRequest } from '../../src/handling/request';
import { CheckEmailDto, signInUserDto, signUpUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { User } from './user-decorator';

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
    // req.session.jwt = userJwt;
    req.session = { jwt: userJwt };
    return res.status(HttpStatus.CREATED).send({
      message: 'Successfully signed up',
      results: userData,
      statusCode: HttpStatus.CREATED,
    });
  }

  @Post('verify')
  async checkEmail(@Body(new ValidationPipe()) checkEmailDto: CheckEmailDto) {
    return await this.authService.checkEmail(checkEmailDto);
  }

  @Post('signin')
  async signInUser(
    @Body(new ValidationPipe()) signInDto: signInUserDto,
    @Req() req: IRequest,
    @Res() res: Response,
  ) {
    console.log('bdy', signInDto);
    const [userData, userJwt] = await this.authService.signInUser(signInDto);
    req.session = { jwt: userJwt };
    // req.session.jwt = userJwt;
    return res.status(HttpStatus.CREATED).send(userData);
  }

  @Post('signout')
  logOutUser(@Req() req: IRequest, @Res() res: Response) {
    // req.session.destroy((err: any) => {
    //   if (err) {
    //     console.log('error destroying session', err);
    //   }
    // });
    // res.clearCookie('connect.sid');
    req.session = null;
    res
      .status(HttpStatus.OK)
      .send({ message: 'Successfully signed out', statusCode: HttpStatus.OK });
  }

  @Get('currentuser')
  getCurrentUser(@User() user: any, @Res() res: Response) {
    const userInfo = user ? { currentUser: user } : { currentUser: null };
    return res.status(HttpStatus.OK).send(userInfo);
  }
}
