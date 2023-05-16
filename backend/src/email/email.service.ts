import { Injectable } from '@nestjs/common';
import { ForgetPasswordDto, ValidateEmailDto } from './email.dto';

@Injectable()
export class EmailService {
  async getEmailValidation(id: string): Promise<any> {
    console.log('id', id);
    // what to do?
  }

  async verifyCode(validateEmailDto: ValidateEmailDto): Promise<any> {
    console.log('validateEmailDto', validateEmailDto);
    // from email, check isEmailValidated and send back info
  }

  async createLinkValidation(id: string): Promise<any> {
    console.log('id', id);
    // what to do ?
  }

  async createLinkForgetPassword(
    forgetPasswordDto: ForgetPasswordDto,
  ): Promise<any> {
    console.log('validateEmailDto', forgetPasswordDto);
    // what to do?
  }
}
