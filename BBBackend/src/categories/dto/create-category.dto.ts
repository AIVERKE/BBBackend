import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Hamburguesas', description: 'Nombre de la categoría' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Nuestras famosas hamburguesas artesanales', description: 'Descripción opcional', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: 'ID del negocio al que pertenece' })
  @IsNumber()
  @IsNotEmpty()
  tenantId: number;

  @ApiProperty({ example: 'https://cdn.com/icon.png', description: 'URL del icono', required: false })
  @IsString()
  @IsOptional()
  iconUrl?: string;
}
