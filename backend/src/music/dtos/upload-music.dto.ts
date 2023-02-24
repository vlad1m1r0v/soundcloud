import { IsNotEmpty, IsString, IsEmail, IsUrl } from 'class-validator';

export class UploadMusicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  artist: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
