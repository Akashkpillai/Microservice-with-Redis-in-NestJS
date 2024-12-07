import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MailerService } from '../mailer/mailer.service';

@Controller()
export class NotificationController {
  constructor(private readonly mailerService: MailerService) {}

  @MessagePattern('send_email') // Listen for the 'send_email' Redis event
  async handleSendEmail(payload: {
    to: string;
    subject: string;
    html?: string;
  }) {
    const { to, subject, html } = payload;
    try {
      await this.mailerService.sendMail(to, subject, html);
      return { status: 'success', message: 'Email sent successfully!' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
