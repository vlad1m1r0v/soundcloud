import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AzureBlobService } from 'src/common/modules/azure/azure.service';
import { Repository } from 'typeorm';
import { Music } from './music.entity';
import { UploadMusicDto } from './dtos';

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
    return url;
  }

  async uploadMusic(userId: string, dto: UploadMusicDto) {
    const entity = this.musicRepository.create({ userId, ...dto });
    const uploadedMusic = this.musicRepository.save(entity);
    return uploadedMusic;
  }
}
