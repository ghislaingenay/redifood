import { NotFoundException } from '@nestjs/common';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

import {
  ELanguage,
  TEmailType,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { Setting, SettingsDoc } from '../models/settings.model';
import { IUserData, User, UserDoc } from '../models/users.model';

class EmailProvider {
  protected lang: ELanguage;
  protected userId: UserPayload['id'];
  protected emailType: TEmailType;
  private client!: MailerSend;
  private sender = new Sender('ghislain@food.com', 'Ghislain'); // (email, 'my name')
  private recepients: Recipient[];
  private htmlText: string;
  private codePassword!: any;

  constructor(
    emailType: TEmailType,
    userId: UserPayload['id'],
    codePassword?: string,
  ) {
    this.userId = userId;
    this.emailType = emailType;
    this.codePassword = codePassword;
  }

  private templates: { type: TEmailType; id: string; lang: ELanguage }[] = [
    {
      type: 'FORGET_PASSWORD',
      id: 'ynrw7gy6ojkl2k8e',
      lang: ELanguage.ENGLISH,
    },
    {
      type: 'VALIDATE_EMAIL',
      id: 'z86org89p6k4ew13',
      lang: ELanguage.FRENCH,
    },
  ];

  private verifyKey() {
    if (!process.env.MAILSENDER_API_KEY) {
      throw new NotFoundException();
    }
  }

  private initializeClient() {
    this.verifyKey();
    this.client = new MailerSend({
      apiKey: process.env.MAILSENDER_API_KEY,
    });
  }

  private async getUser(): Promise<UserDoc> {
    return await User.findById(this.userId);
  }

  private async getSettings(): Promise<SettingsDoc> {
    return await Setting.findOne({ user: this.userId });
  }

  private async createRecipient(): Promise<void> {
    const userData = await this.getUser();
    this.recepients = [
      new Recipient(
        userData.email,
        `${userData.firstName} ${userData.lastName}`,
      ),
    ];
  }

  private async getTemplateText(): Promise<void> {
    // const settingsData = await this.getSettings();
    const templateInformation = this.templates.find(
      (item) => item.type === this.emailType,
    );
    const template_id = templateInformation.id;

    const response = this.client.email.template
      .single(template_id)
      // .single(`${this.emailType}_${settingsData.language}`)
      .catch((error) => console.log(error.body));
    this.htmlText = (response as any).body as string;
  }

  private async createHTML(): Promise<string> {
    const regex = /{{(.*?)}}/g;
    const matches = this.htmlText.match(regex);
    let html: string = this.htmlText;
    const userData: Omit<IUserData, 'password'> = JSON.parse(
      JSON.stringify(await this.getUser()),
    );
    let updatedData: Record<string, any> = userData;
    if (this.emailType === 'FORGET_PASSWORD') {
      updatedData = { ...updatedData, codePassword: this.codePassword };
    }
    if (matches) {
      matches.forEach((match) => {
        const key = match.replace('{{', '').replace('}}', '');
        const value =
          updatedData[key as keyof typeof updatedData] || ('' as any);
        html = html.replace(match, value);
      });
      return html;
    }
  }

  private setSubject() {
    switch (this.emailType) {
      case 'VALIDATE_EMAIL':
        return this.lang === ELanguage.ENGLISH
          ? 'FOOD - Email validation'
          : 'FOOD - Validation de votre email';
      default:
        return this.lang === ELanguage.ENGLISH
          ? 'FOOD - Reset your password'
          : 'FOOD - Réinitializer votre mot de passe';
    }
  }

  public async sendEmail(): Promise<void> {
    this.initializeClient();
    await this.createRecipient(); // this.recepients
    await this.getTemplateText(); // this.htmlText
    const html = await this.createHTML();
    const emailParams = new EmailParams()
      .setFrom(this.sender)
      .setTo(this.recepients)
      .setSubject(this.setSubject())
      .setHtml(html);
    await this.client.email.send(emailParams);
  }
}

export default EmailProvider;
