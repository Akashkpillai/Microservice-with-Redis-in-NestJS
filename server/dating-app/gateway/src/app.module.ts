// app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        // Use a unique name for the microservice client
        name: 'API_GATEWAY_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost', // adjust as needed (or use env variables)
          port: 6379,
          // Optional: enable wildcards if you need pattern matching
          wildcards: false,
          // Optional: adjust retryAttempts and retryDelay as required
          retryAttempts: 5,
          retryDelay: 3000,
        },
      },
      // Register additional services if needed...
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
