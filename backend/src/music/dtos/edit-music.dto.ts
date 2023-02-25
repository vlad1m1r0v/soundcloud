import { IsNotEmpty, IsString } from 'class-validator';

export class EditMusicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  artist: string;
}
