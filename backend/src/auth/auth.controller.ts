import {
  Body,
  Controller,
  Get,
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
    const authService = new AuthService(req, res);
    return await authService.signUpUser(signUpDto);
  }

  @Post('signin')
  signInUser(
    @Body(new ValidationPipe()) signInDto: signInUserDto,
    @Req() req: IRequest,
    @Res() res: Response,
  ) {
    const authService = new AuthService(req, res);
    return authService.signInUser(signInDto);
  }

  @Post('logout')
  logOutUser() {
    return this.authService.findAll();
  }

  @Get('currentuser')
  getCurrentUser(@User() user: any) {
    return this.authService.getCurrentUser(user);
  }
}
