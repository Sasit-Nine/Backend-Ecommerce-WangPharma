// src/shopping-cart/dto/create-shopping-cart.dto.ts
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShoppingCartDto {
  
  @IsNumber()
  spc_id: number;

  @IsNumber()
  spc_amount: number;

  @IsOptional()
  @IsString()
  spc_unit1?: string;

  @IsOptional()
  @IsEnum(['1', '2', '3'])
  spc_unit2?: '1' | '2' | '3';

  @IsDateString()
  spc_datetime: string; // ส่งเป็น ISO string เช่น 2025-07-17T10:00:00Z

  @IsOptional()
  @IsString()
  spc_comments?: string;

  @IsNumber()
  mem_code: string;

  @IsNumber()
  pro_code: string;
}
