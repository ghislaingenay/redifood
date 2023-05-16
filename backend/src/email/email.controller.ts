import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserPayload } from '../../redifood-module/src/interfaces';
import { User } from '../auth/user-decorator';
import { AuthGuard } from '../global/auth-guard';
import { ValidationPipe } from '../global/validation.pipe';
import { ForgetPasswordDto, ValidateEmailDto } from './email.dto';
import { EmailService } from './email.service';

@Controller('api/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @UseGuards(new AuthGuard())
  @Get('validate')
  async getEmailValidation(@User() user: UserPayload) {
    return await this.emailService.getEmailValidation(user.id);
  }

  @Get('forget-password')
  async verifyCode(
    @Body(new ValidationPipe()) validateEmailDto: ValidateEmailDto,
  ) {
    return await this.emailService.verifyCode(validateEmailDto);
  }

  @UseGuards(new AuthGuard())
  @Post('validate')
  createLinkValidation(@User() user: UserPayload) {
    return this.emailService.createLinkValidation(user.id);
  }

  @UseGuards(new AuthGuard())
  @Post('forget-password')
  createLinkForgetPassword(
    @Body(new ValidationPipe()) forgetPasswordDto: ForgetPasswordDto,
  ) {
    return this.emailService.createLinkForgetPassword(forgetPasswordDto);
  }
}
