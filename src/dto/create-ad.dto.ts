// src/dto/create-ad.dto.ts
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class CreateAdDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
  images: string[];
}
