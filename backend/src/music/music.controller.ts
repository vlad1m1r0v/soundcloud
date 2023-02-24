import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { UploadMusicDto } from './dtos';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post('/file')
  @UseInterceptors(FileInterceptor('music'))
  async uploadMusicFile(@UploadedFile() music: Express.Multer.File) {
    return this.musicService.uploadMusicFile(music);
  }

  @Post()
  async uploadMusic(
    @GetCurrentUserId() userId: string,
    @Body() dto: UploadMusicDto,
  ) {
    return this.musicService.uploadMusic(userId, dto);
  }
}
