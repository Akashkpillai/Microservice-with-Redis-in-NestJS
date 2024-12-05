import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { HelperModule } from './helpers/helpers.module';
import { PrismaService } from './prisma/prisma.service';
// import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [UserModule, HelperModule],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {}
