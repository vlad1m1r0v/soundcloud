import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AzureBlobService } from 'src/common/modules/azure/azure.service';
import { Repository } from 'typeorm';
import { Music } from './music.entity';
import { UploadMusicDto } from './dtos/upload-music.dto';

interface UploadMusicProps {
  userId: string;
  dto: UploadMusicDto;
  music: Express.Multer.File;
}

@Injectable()
export class MusicService {
  private readonly containerName = 'music';

  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @Inject(AzureBlobService)
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async upload({ userId, dto, music }: UploadMusicProps) {
    try {
      const url = await this.azureBlobService.upload(music, this.containerName);
      const entity = this.musicRepository.create({ userId, url, ...dto });
      const uploadedMusic = this.musicRepository.save(entity);
      return uploadedMusic;
    } catch {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
