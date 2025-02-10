import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bull';
import { defaultIfEmpty, lastValueFrom } from 'rxjs';

@Controller('api-gateway')
export class UserEventController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  @Get('user')
  async getUser() {
    const observable$ = this.userServiceClient
      .emit({ cmd: 'get_user' }, {})
      .pipe(defaultIfEmpty(null));

    // Convert the observable to a promise.
    const result = await lastValueFrom(observable$);

    if (!result) {
      throw new HttpException(
        { message: 'No user data returned' },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}
