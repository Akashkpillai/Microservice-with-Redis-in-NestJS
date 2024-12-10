import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MailerService } from '../mailer/mailer.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller()
export class NotificationController {
  constructor(
    @InjectQueue('email-queue')
    private emailQueue: Queue,
    private readonly mailerService: MailerService,
  ) {}

  @EventPattern('send_email') // Listen for the 'send_email' Redis event
  async handleSendEmail(payload: {
    to: string;
    subject: string;
    html?: string;
  }) {
    // const { to, subject, html } = payload;
    try {
      //add email to queue
      await this.emailQueue.add('send-email-job', payload, {
        attempts: 3, // Retry up to 3 times on failure
        backoff: 5000, // Wait 5 seconds between retries
      });
      console.log('Email added to queue');
      // await this.mailerService.sendMail(to, subject, html);
      return { status: 'success', message: 'Email sent successfully!' };
    } catch (error) {
      console.error('Failed to add job to queue:', error.message);
      return { status: 'error', message: error.message };
    }
  }
}
