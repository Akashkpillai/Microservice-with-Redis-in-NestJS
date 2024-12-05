import { Module } from '@nestjs/common';
import { NotificationService } from './notification/notification.service';
import { NotificationController } from './notification/notification.controller';
import { MailerService } from './mailer/mailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NotificationController],
  providers: [NotificationService, MailerService],
})
export class AppModule {}
