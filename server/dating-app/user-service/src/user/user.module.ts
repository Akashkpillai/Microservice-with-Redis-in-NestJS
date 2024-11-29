import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import UtilsService from 'src/helpers/service/util.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UtilsService],
})
export class UserModule {}
