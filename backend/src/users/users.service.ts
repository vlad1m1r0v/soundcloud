import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AzureBlobService } from 'src/common/modules/azure/azure.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos';
import { Users } from './users.entity';
import { extname } from 'path';
import { ErrorMessage } from 'src/common/enums';
import { bufferToStream, cropImage } from 'src/common/helpers';

@Injectable()
export class UsersService {
  private readonly containerName = 'images';
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @Inject(AzureBlobService)
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async update(userId: string, dto: UpdateUserDto) {
    try {
      await this.usersRepository.update({ id: userId }, { ...dto });
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      throw new BadRequestException(ErrorMessage.INVALID_CREDETIALS);
    }
  }

  async deleteAvatar(userId: string) {
    const profile = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (profile.avatar) {
      await this.azureBlobService.delete(profile.avatar, this.containerName);
      await this.usersRepository.update({ id: userId }, { avatar: null });
    }
  }

  async updateAvatar(userId: string, image: Express.Multer.File) {
    try {
      await this.deleteAvatar(userId);
      const imageBuffer = await cropImage(image.buffer);
      const imageStream = bufferToStream(imageBuffer);
      const updatedAvatar = await this.azureBlobService.uploadStream({
        fileExtension: extname(image.originalname),
        mimeType: image.mimetype,
        containerName: this.containerName,
        stream: imageStream,
      });
      await this.usersRepository.update(
        { id: userId },
        { avatar: updatedAvatar },
      );
      const updatedUser = await this.usersRepository.findOne({
        where: { id: userId },
      });
      return updatedUser;
    } catch {
      throw new BadRequestException(ErrorMessage.INVALID_CREDETIALS);
    }
  }
}
