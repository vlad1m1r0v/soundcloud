import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UploadMusicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  artist: string;
}
