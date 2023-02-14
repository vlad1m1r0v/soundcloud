import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AzureModule } from 'src/common/modules/azure/azure.module';
import { MusicController } from './music.controller';
import { Music } from './music.entity';
import { MusicService } from './music.service';

@Module({
  imports: [TypeOrmModule.forFeature([Music]), AzureModule],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
