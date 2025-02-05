// src/dto/update-ad.dto.ts
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateAdDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
