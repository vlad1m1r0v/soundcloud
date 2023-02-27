import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { UpdatePlaylistDto } from './dtos/update-playlist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Put('/:id/cover')
  async updateCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log({ id, file });
    return this.playlistService.updateCover(id, file);
  }

  @Delete('/:id/cover')
  async deleteCover(@Param('id') id: string) {
    return this.playlistService.deleteCover(id);
  }

  @Post()
  async createPlaylist(
    @GetCurrentUserId() userId: string,
    @Body() dto: CreatePlaylistDto,
  ) {
    return this.playlistService.createPlaylist(userId, dto);
  }

  @Put('/:id')
  async updatePlaylist(
    @Param('id') id: string,
    @Body() dto: UpdatePlaylistDto,
  ) {
    return this.playlistService.updatePlaylist(id, dto);
  }
}
