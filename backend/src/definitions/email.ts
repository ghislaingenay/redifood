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
  private client: MailerSend;
  private sender = new Sender('ghislain@food.com', 'Ghislain'); // (email, 'my name')
  private recepients: Recipient[];

  constructor(lang: ELanguage, userId: UserPayload['id']) {
    this.lang = lang;
    this.userId = userId;
  }

  private verifyKey() {
    if (!process.env.MAILSENDER_API_KEY) {
      throw new NotFoundException();
    }
  }

  private initialize() {
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

  private async createRecepient(): Promise<void> {
    const userData = await this.getUser();
    this.recepients = [
      new Recipient(
        userData.email,
        `${userData.firstName} ${userData.lastName}`,
      ),
    ];
  }

  // recipients = [new Recipient('your@client.com', 'Your Client')];

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
