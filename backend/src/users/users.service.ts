import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
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
}
