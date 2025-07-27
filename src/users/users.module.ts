import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/core/prisma.service';
import { UsersController } from './users.controller';
import { JwtStrategy } from '../auth/passport/jwt.strategy';

@Module({
  providers: [UsersService, PrismaService, JwtStrategy],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
