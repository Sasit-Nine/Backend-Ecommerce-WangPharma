// src/members/dto/create-member.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  mem_code: string;

  @IsString()
  mem_username: string;

  @IsString()
  mem_password: string;

  @IsString()
  mem_nameSite: string;

  @IsOptional()
  @IsString()
  mem_license?: string;

  @IsOptional()
  @IsString()
  mem_daystart?: string;

  @IsOptional()
  @IsString()
  mem_dayend?: string;

  @IsOptional()
  @IsString()
  mem_timestart?: string;

  @IsOptional()
  @IsString()
  mem_timeend?: string;

  @IsOptional()
  @IsString()
  mem_type_id?: string;

  @IsOptional()
  @IsNumber()
  mem_price_varchar?: number;

  @IsOptional()
  @IsString()
  mem_taxid?: string;

  @IsOptional()
  @IsString()
  mem_suboffice?: string;

  @IsOptional()
  @IsString()
  mem_address?: string;

  @IsOptional()
  @IsString()
  mem_village?: string;

  @IsOptional()
  @IsString()
  mem_alley?: string;

  @IsOptional()
  @IsString()
  mem_road?: string;

  @IsOptional()
  @IsString()
  mem_province?: string;

  @IsOptional()
  @IsString()
  mem_amphur?: string;

  @IsOptional()
  @IsString()
  mem_tumbon?: string;

  @IsOptional()
  @IsString()
  mem_post?: string;

  @IsOptional()
  @IsString()
  mem_salepoffice?: string;

  @IsOptional()
  @IsString()
  mem_img1?: string;

  @IsOptional()
  @IsString()
  mem_img2?: string;

  @IsOptional()
  @IsString()
  mem_img3?: string;

  @IsOptional()
  @IsNumber()
  mem_Ccoin?: number;

  @IsOptional()
  @IsNumber()
  mem_license_decimal?: number;
}
