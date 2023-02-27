import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extname } from 'path';
import { ErrorMessage } from 'src/common/enums';
import { bufferToStream, cropImage } from 'src/common/helpers';
import { AzureBlobService } from 'src/common/modules/azure/azure.service';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { UpdatePlaylistDto } from './dtos/update-playlist.dto';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistService {
  private readonly containerName = 'images';
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @Inject(AzureBlobService)
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async deleteCover(playlistId: string) {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
    });
    if (playlist.cover) {
      await this.azureBlobService.delete(playlist.cover, this.containerName);
      await this.playlistRepository.update({ id: playlistId }, { cover: null });
    }

    const updatedPlaylist = await this.playlistRepository.findOne({
      where: { id: playlistId },
    });
    return updatedPlaylist;
  }

  async updateCover(playlistId: string, image: Express.Multer.File) {
    try {
      await this.deleteCover(playlistId);
      const imageBuffer = await cropImage(image.buffer);
      const imageStream = bufferToStream(imageBuffer);
      const updatedCover = await this.azureBlobService.uploadStream({
        fileExtension: extname(image.originalname),
        mimeType: image.mimetype,
        containerName: this.containerName,
        stream: imageStream,
      });
      await this.playlistRepository.update(
        { id: playlistId },
        { cover: updatedCover },
      );
      const updatedPlaylist = await this.playlistRepository.findOne({
        where: { id: playlistId },
      });
      return updatedPlaylist;
    } catch {
      throw new BadRequestException(ErrorMessage.INVALID_CREDETIALS);
    }
  }

  async createPlaylist(userId: string, dto: CreatePlaylistDto) {
    const entity = this.playlistRepository.create({
      user: { id: userId },
      ...dto,
    });
    const playlist = await this.playlistRepository.save(entity);
    return playlist;
  }

  async updatePlaylist(playlistId: string, dto: UpdatePlaylistDto) {
    await this.playlistRepository.update({ id: playlistId }, { ...dto });

    const updatedPlaylist = await this.playlistRepository.findOne({
      where: { id: playlistId },
    });
    return updatedPlaylist;
  }
}
