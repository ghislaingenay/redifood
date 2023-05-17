import { HttpStatus, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { DatabaseError } from '../../redifood-module/src/handling-nestjs/database-error.exception';
import {
  IGetServerSideData,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { Email } from '../models/email.model';
import { ForgetPasswordDto, ValidateEmailDto } from './email.dto';

@Injectable()
export class EmailService {
  async getEmailValidation(
    userId: UserPayload['id'],
  ): Promise<
    IGetServerSideData<{ isValidated: boolean; expiresAt: Date | null }>
  > {
    console.log('id', userId);
    const emailData = await Email.findOne({ user: userId });
    if (!emailData) {
      return {
        results: { isValidated: false, expiresAt: null },
        statusCode: HttpStatus.OK,
        message: 'Email validation',
      }; // User should'nt know if email is validated or not
    }
    return {
      results: {
        isValidated: emailData.isEmailValidated,
        expiresAt: emailData.expirationValidLink,
      },
      statusCode: HttpStatus.OK,
      message: 'Email validation',
    };
  }

  async verifyCode(
    validateEmailDto: ValidateEmailDto,
  ): Promise<IGetServerSideData<{ verified: boolean }>> {
    const { email, code } = validateEmailDto;

    const nonVerifiedRes = {
      results: { verified: false },
      statusCode: HttpStatus.OK,
      message:
        'An issue occurred while sending the email. Please send a new code',
    };
    try {
      const emailData = await Email.findOne({ email });
      if (!emailData) {
        return nonVerifiedRes;
      }

      const now = new Date();
      if (moment(now).isAfter(emailData.expirationCodePassword)) {
        return nonVerifiedRes;
      }

      if (code === emailData.codePassword) {
        await Email.findOneAndUpdate({ email }, { isEmailValidated: true });
        return {
          results: { verified: true },
          statusCode: HttpStatus.OK,
          message: 'Verified information',
        };
      } else {
        return nonVerifiedRes;
      }
    } catch (err) {
      throw new DatabaseError();
    }
  }

  async createLinkValidation(id: string): Promise<any> {
    console.log('id', id);
    // 1 - Extends the expiration date for code
    // 2 - Send email with the link on client
    // 3 - When user click on the link, it will redirect to the client with the code
    // 4 - Check on client with the date
  }

  async createLinkForgetPassword(
    forgetPasswordDto: ForgetPasswordDto,
  ): Promise<any> {
    console.log('validateEmailDto', forgetPasswordDto);
    // Create a code
    // send code in db with expiration date (15 min)
    // create a email with the code

    // on client, when user forget password, => open modal with code and ask to check email => fill the code from
    // the email and send request to BE => call verifyCode API after it
  }
}
