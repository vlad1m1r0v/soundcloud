import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDate,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDate()
  birthDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}
