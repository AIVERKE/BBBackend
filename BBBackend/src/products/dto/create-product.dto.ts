import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Hamburguesa Triple Cheese', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Tres carnes de 150g, mucho queso y bacon', description: 'Descripción detallada', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 15.50, description: 'Precio de venta' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'https://cdn.com/burger.jpg', description: 'URL de la imagen', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 1, description: 'ID de la categoría a la que pertenece' })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ example: 1, description: 'ID del negocio' })
  @IsNumber()
  @IsNotEmpty()
  tenantId: number;

  @ApiProperty({ example: true, description: 'Disponibilidad del producto', required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
