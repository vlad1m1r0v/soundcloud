import {
  Body,
  Controller,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Put('profile')
  async update(@GetCurrentUserId() userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(userId, dto);
  }
  @Put('profile/avatar')
  @UseInterceptors(FileInterceptor('image'))
  async updateAvatar(
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(userId, file);
  }
}
