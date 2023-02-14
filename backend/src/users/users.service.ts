import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AzureBlobService } from 'src/common/modules/azure/azure.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Users } from './users.entity';
import * as sharp from 'sharp';
import { Readable } from 'stream';
import { extname } from 'path';

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
      const { password, hashedRT, ...rest } = user;
      return rest;
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const profile = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (profile.avatar)
      await this.azureBlobService.delete(profile.avatar, this.containerName);
    const fileBuffer = await sharp(file.buffer).resize(300, 300).toBuffer();
    const stream = Readable.from(fileBuffer);
    const updatedAvatar = await this.azureBlobService.uploadStream({
      fileExtension: extname(file.originalname),
      mimeType: file.mimetype,
      containerName: this.containerName,
      stream,
    });
    console.log({ updatedAvatar, userId });
    await this.usersRepository.update(
      { id: userId },
      { avatar: updatedAvatar },
    );
    const updatedUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    return updatedUser;
  }
}
