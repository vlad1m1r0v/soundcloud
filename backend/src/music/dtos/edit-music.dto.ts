import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class EditMusicDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  artist?: string;

  @IsOptional()
  @IsUUID(undefined, { each: true })
  genres?: string[];
}
