// src/product/dto/create-product.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  IsDecimal,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  pro_code: string;

  @IsString()
  pro_name: string;

  @IsOptional()
  @IsString()
  pro_nameEN?: string;

  @IsOptional()
  @IsString()
  pro_nameSale?: string;

  @IsOptional()
  @IsString()
  pro_namePacking?: string;

  @IsOptional()
  @IsString()
  pro_genericname?: string;

  @IsArray()
  pro_keysearch: string[];

  @IsNumber()
  pro_priceA: number;

  @IsNumber()
  pro_priceB: number;

  @IsNumber()
  pro_priceC: number;

  @IsNumber()
  pro_cost: number;

  @IsOptional()
  @IsString()
  pro_supplier?: string;

  @IsOptional()
  @IsString()
  pro_barcode1?: string;

  @IsOptional()
  @IsString()
  pro_barcode2?: string;

  @IsOptional()
  @IsString()
  pro_barcode3?: string;

  @IsEnum(['Y', 'N'])
  @IsOptional()
  pro_isdrug?: 'Y' | 'N';

  @IsEnum(['Y', 'N'])
  @IsOptional()
  pro_isvat?: 'Y' | 'N';

  @IsEnum(['Y', 'N'])
  @IsOptional()
  pro_ishot?: 'Y' | 'N';

  @IsOptional()
  @IsString()
  pro_drugregister?: string;

  @IsOptional()
  @IsNumber()
  pro_utility?: number;
}
