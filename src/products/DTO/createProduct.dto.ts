import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProduct {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNotEmpty()
  @IsString()
  userId: string; // Reference to the user who owns the product
}
