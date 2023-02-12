import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), JwtModule.register({})],
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
