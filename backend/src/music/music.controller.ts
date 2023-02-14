import {
  Controller,
  Headers,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post()
  @UseInterceptors(FileInterceptor('music'))
  async upload(
    @Headers('x-music-name') name: string,
    @Headers('x-music-artist') artist: string,
    @GetCurrentUserId() userId: string,
    @UploadedFile() music: Express.Multer.File,
  ) {
    return this.musicService.upload({ userId, music, dto: { name, artist } });
  }
}
