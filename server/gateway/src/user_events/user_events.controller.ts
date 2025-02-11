import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bull';
import { catchError, defaultIfEmpty, lastValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create.dto';

@Controller('api-gateway/user')
export class UserEventController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  @Get()
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

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    try {
      const observable$ = this.userServiceClient
        .send({ cmd: 'register_user' }, data)
        .pipe(
          // If an error occurs in the microservice, catch it here, log it,
          // and rethrow so that it is caught by the try/catch below.
          catchError((err) => {
            console.error('Error from microservice:', err);
            // Rethrow the error so that lastValueFrom will reject with it.
            throw err;
          }),
        );

      // Await the response. If the observable errors (or is empty), this will throw.
      const result = await lastValueFrom(observable$);
      return result;
    } catch (error) {
      console.error('Caught error in API gateway:', error);

      // If the error is from the microservice, it might have its own message and status.
      // You can forward those details. For example:
      throw new HttpException(
        error.message || 'Failed to register user',
        error.status || HttpStatus.CONFLICT,
      );
    }
  }
}
