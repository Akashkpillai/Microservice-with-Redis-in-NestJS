import { Module } from '@nestjs/common';
import { NotificationService } from './notification/notification.service';
import { NotificationController } from './notification/notification.controller';
import { MailerService } from './mailer/mailer.service';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './processor/email.processor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, MailerService, EmailProcessor],
})
export class AppModule {}
