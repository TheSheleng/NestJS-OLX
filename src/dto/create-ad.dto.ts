// src/dto/create-ad.dto.ts
import { IsOptional, IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Category } from 'src/entity/category.entity';

export class CreateAdDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  category?: Category;
}
