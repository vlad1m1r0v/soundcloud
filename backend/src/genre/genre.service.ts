import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessage } from 'src/common/enums';
import { Repository } from 'typeorm';
import { GenreDto } from './dtos';
import { Genre } from './genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(dto: GenreDto) {
    const entity = this.genreRepository.create({ ...dto });
    const genre = await this.genreRepository.save(entity);
    return genre;
  }

  async find(substring: string) {
    const genres = await this.genreRepository
      .createQueryBuilder('genre')
      .where('genre.name like :name', { name: `%${substring}%` })
      .getMany();
    return genres;
  }
}
