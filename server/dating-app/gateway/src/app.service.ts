import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('API_GATEWAY_SERVICE') private readonly clientService: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
}
