import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AzureBlobService } from 'src/common/modules/azure/azure.service';
import { Repository } from 'typeorm';
import { Music } from './music.entity';
import { EditMusicDto, UploadMusicDto } from './dtos';
import { ErrorMessage } from 'src/common/enums';

@Injectable()
export class MusicService {
  private readonly containerName = 'music';

  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @Inject(AzureBlobService)
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async uploadMusicFile(music: Express.Multer.File) {
    const url = await this.azureBlobService.upload(music, this.containerName);
    return { url };
  }

  async uploadMusic(userId: string, dto: UploadMusicDto) {
    const { genres = [], ...rest } = dto;
    const entity = this.musicRepository.create({
      user: { id: userId },
      ...rest,
    });
    await this.musicRepository
      .createQueryBuilder()
      .relation('genres')
      .of(entity)
      .addAndRemove(genres, []);
    const uploadedMusic = this.musicRepository.save(entity);
    return uploadedMusic;
  }

  async editMusic(musicId: string, dto: EditMusicDto) {
    try {
      const { genres = [], ...rest } = dto;
      const previousGenres = await this.musicRepository
        .createQueryBuilder()
        .relation('genres')
        .of({ id: musicId })
        .loadMany();
      await this.musicRepository
        .createQueryBuilder()
        .relation('genres')
        .of({ id: musicId })
        .addAndRemove(genres, previousGenres);
      await this.musicRepository.update({ id: musicId }, { ...rest });
      const music = await this.musicRepository
        .createQueryBuilder('music')
        .leftJoinAndSelect('music.genres', 'genre')
        .getMany();
      return music;
    } catch {
      throw new BadRequestException(ErrorMessage.INVALID_CREDETIALS);
    }
  }

  async deleteMusic(musicId: string) {
    try {
      const music = await this.musicRepository.findOneOrFail({
        where: { id: musicId },
      });
      await this.azureBlobService.delete(music.url, this.containerName);
      await this.musicRepository.delete({ id: musicId });
    } catch {
      throw new BadRequestException(ErrorMessage.INVALID_CREDETIALS);
    }
  }
}
