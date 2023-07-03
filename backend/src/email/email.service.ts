import { HttpStatus, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import EmailProvider from 'src/definitions/email-provider';
import { User } from 'src/models/users.model';
import {
  ELanguage,
  IGetServerSideData,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { Email } from '../models/email.model';
import { DatabaseError } from './../others/database-error.exception';
import { ForgetPasswordDto, ValidateEmailDto } from './email.dto';

@Injectable()
export class EmailService {
  async getEmailValidation(
    userId: UserPayload['id'],
  ): Promise<
    IGetServerSideData<{ isValidated: boolean; expiresAt: Date | null }>
  > {
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

  async createLinkValidation(
    userId: UserPayload['id'],
  ): Promise<IGetServerSideData<any>> {
    const expireIn1Hour = new Date(new Date().getTime() + 60 * 60 * 1000);
    await Email.findOneAndUpdate(
      { user: userId },
      { expirationValidLink: expireIn1Hour },
    );
    const email = new EmailProvider('VALIDATE_EMAIL', userId);
    await email.sendEmail();
    return {
      results: {},
      message: 'Updated link',
      statusCode: HttpStatus.OK,
    };
  }

  async createLinkForgetPassword(
    forgetPasswordDto: ForgetPasswordDto,
  ): Promise<IGetServerSideData<any>> {
    const { email, lang } = forgetPasswordDto;
    const msgEmail =
      lang === ELanguage.ENGLISH
        ? 'A email was sent to your mailbox if the email you provided was valid'
        : "Un email a été envoyé à ta messagerie si l'email est coorect";
    console.log('validateEmailDto', forgetPasswordDto);
    const newCode = String(
      Math.floor(Math.random() * (999999 - 100000 + 1) + 100000),
    );
    const expiresIn15min = new Date(new Date().getTime() + 15 * 60 * 1000);
    try {
      await Email.findOneAndUpdate(
        { email },
        { expirationCodePassword: expiresIn15min, codePassword: newCode },
      );
      const userData = await User.findOne({ email });
      await new EmailProvider(
        'FORGET_PASSWORD',
        userData.id,
        newCode,
      ).sendEmail();
      return {
        results: {},
        statusCode: HttpStatus.OK,
        message: msgEmail,
      };
    } catch (err) {
      return {
        results: {},
        statusCode: HttpStatus.OK,
        message: msgEmail,
      };
    }

    // Create a code
    // send code in db with expiration date (15 min)
    // create a email with the code

    // on client, when user forget password, => open modal with code and ask to check email => fill the code from
    // the email and send request to BE => call verifyCode API after it
  }
}
