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
import { Repository } from 'src/common/decorators/repository.decorator';
import { MusicService } from './music.service';
import { IsCreator } from 'src/common/guards';

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

  @UseGuards(IsCreator)
  @Put('/:id')
  @Repository('music')
  async editMusic(@Param('id') id: string, @Body() dto: EditMusicDto) {
    return this.musicService.editMusic(id, dto);
  }

  @UseGuards(IsCreator)
  @Delete('/:id')
  @Repository('music')
  async deleteMusic(@Param('id') id: string) {
    return this.musicService.deleteMusic(id);
  }
}
