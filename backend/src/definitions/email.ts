import { NotFoundException } from '@nestjs/common';
import { MailerSend, Recipient, Sender } from 'mailersend';

import {
  ELanguage,
  TEmailType,
  UserPayload,
} from '../../redifood-module/src/interfaces';
import { Setting, SettingsDoc } from '../../src/models/settings.model';
import { User, UserDoc } from '../../src/models/users.model';

class EmailService {
  protected lang: ELanguage;
  protected userId: UserPayload['id'];
  protected emailType: TEmailType;
  private client!: MailerSend;
  private sender = new Sender('ghislain@food.com', 'Ghislain'); // (email, 'my name')
  private recepients: Recipient[];
  private htmlText: string;
  private userEmail: string;

  constructor(emailType: TEmailType, userId: UserPayload['id']) {
    this.userId = userId;
    this.emailType = emailType;
  }

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
    this.userEmail = userData.email;
  }

  private async getTemplateText(): Promise<void> {
    const settingsData = await this.getSettings();
    const response = this.client.email.template
      .single(`${this.emailType}_${settingsData.language}`)
      .catch((error) => console.log(error.body));
    this.htmlText = (response as any).body as string;
  }

  private async implementVariables(): Promise<{ email: string; substitutions: { var: string; value: string }[] }[]> {}

  protected async sendEmail(): Promise<void> {}
    this.initializeClient();
    await this.createRecipient(); // this.recepients
    await this.getTemplateText(); // this.htmlText
  }

  // private async createEmailParams(): Promise<void> {
  //   const settingsData = await this.getSettings();
  //   const emailParams = {
  //     from: this.sender,
  //     to: this.recepients,
  //     subject: 'Subject',
  //     text: 'Text',
  //     html: 'HTML',
  //     variables: [
  //       {
  //         email: '  ',
  //         substitutions: [

  // personalization = [
  //   {
  //     email: 'your@client.com',
  //     data: {
  //       test: 'Test Value',
  //     },
  //   },
  // ];

  variables = [
    {
      email: 'your@client.com',
      substitutions: [
        {
          var: 'test',
          value: 'Test Value',
        },
      ],
    },
  ];

  async sendEmail() {
    //empty
  }

  // const emailParams = new EmailParams()
  //   .setFrom(sentFrom)
  //   .setTo(recipients)
  //   .setReplyTo(sentFrom)
  //   .setVariables(variables)
  //   .setSubject("Subject, {$test}")
  //   .setHtml("This is the HTML content, {$test}")
  //   .setText("This is the text content, {$test}");

  // await mailerSend.email.send(emailParams)

  // const variables = [
  //   {
  //     email: "your@client.com",
  //     substitutions: [
  //       {
  //         var: 'test',
  //         value: 'Test Value'
  //       }
  //     ],
  //   }
  // ];

  // const emailParams = new EmailParams()
  //   .setFrom(sentFrom)
  //   .setTo(recipients)
  //   .setReplyTo(sentFrom)
  //   .setVariables(variables)
  //   .setSubject("Subject, {$test}")
  //   .setHtml("This is the HTML content, {$test}")
  //   .setText("This is the text content, {$test}");

  // mailerSend.email.template.single("domain_id")
  // .then((response) => console.log(response.body))
  // .catch((error) => console.log(error.body));

  //   onst emailParams = new EmailParams()
  //   .setFrom(sentFrom)
  //   .setTo(recipients)
  //   .setReplyTo(sentFrom)
  //   .setPersonalization(personalization)
  //   .setSubject("Subject, {{ test }}")
  //   .setHtml("This is the HTML content, {{ test }}")
  //   .setText("This is the text content, {{ test }}");

  // await mailerSend.email.send(emailParams);
}

export default EmailService;

// 1 - Initial mailSender client
//

//  Add enum for template name (when created)
