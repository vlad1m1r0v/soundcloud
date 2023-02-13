import {
  Body,
  Controller,
  Inject,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { AzureBlobService } from 'src/common/modules/azure/azure.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly containerName = 'images';
  constructor(
    @Inject(AzureBlobService)
    private readonly azureBlobService: AzureBlobService,
    private readonly usersService: UsersService,
  ) {}
  @Put('update')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @GetCurrentUserId() userId: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const avatar = await this.azureBlobService.upload(
        file,
        this.containerName,
      );
      return this.usersService.update(userId, { ...dto, avatar });
    }
    return this.usersService.update(userId, dto);
  }
}
