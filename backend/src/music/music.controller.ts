import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { EditMusicDto, UploadMusicDto } from './dtos';
import { MusicCreatorGuard } from './music.guard';
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

  @Put('/:id')
  @UseGuards(MusicCreatorGuard)
  async editMusic(@Param('id') id: string, @Body() dto: EditMusicDto) {
    return this.musicService.editMusic(id, dto);
  }

  @Delete('/:id')
  @UseGuards(MusicCreatorGuard)
  async deleteMusic(@Param('id') id: string) {
    return this.musicService.deleteMusic(id);
  }
}
