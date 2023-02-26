import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreDto } from './dtos';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  create(@Body() dto: GenreDto) {
    return this.genreService.create(dto);
  }

  @Get()
  find(@Query() query: { substring: string }) {
    return this.genreService.find(query.substring);
  }
}
