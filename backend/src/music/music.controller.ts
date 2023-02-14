import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { UploadMusicDto } from './dtos/upload-music.dto';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post()
  @UseInterceptors(FileInterceptor('music'))
  async upload(
    @GetCurrentUserId() userId: string,
    @UploadedFile() music: Express.Multer.File,
    @Body() body: { [prop: string]: any; data: string },
  ) {
    const dto = JSON.parse(body.data) as UploadMusicDto;
    return this.musicService.upload({ userId, music, dto });
  }
}
