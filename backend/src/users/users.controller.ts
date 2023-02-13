import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from 'src/common/modules/azure/azure.service';

@Controller('users')
export class UsersController {
  private readonly containerName = 'images';
  constructor(
    @Inject(AzureBlobService)
    private readonly azureBlobService: AzureBlobService,
  ) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return await this.azureBlobService.upload(file, this.containerName);
  }
}
