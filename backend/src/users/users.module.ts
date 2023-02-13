import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AzureModule } from 'src/common/modules/azure/azure.module';
import { UsersController } from './users.controller';
import { Users } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), AzureModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
