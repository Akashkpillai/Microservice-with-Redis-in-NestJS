import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: +this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: '"Cupid" <akashkpillai55@gmail.com>', // Sender address
        to, // Recipient(s)
        subject, // Email subject
        text, // Plain text body
        html, // HTML body (optional)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
    } catch (error) {
      console.error('Error sending email: ', error);
      throw error;
    }
  }
}
