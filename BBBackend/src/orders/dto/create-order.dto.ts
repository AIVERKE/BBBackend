import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID del producto a pedir' })
  @IsNumber()
  productId!: number;

  @ApiProperty({ example: 2, description: 'Cantidad de unidades' })
  @IsNumber()
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID del restaurante/negocio' })
  @IsNumber()
  tenantId!: number;

  @ApiProperty({ example: 'Mesa 12', description: 'Referencia del pedido (opcional)', required: false })
  @IsString()
  @IsOptional()
  orderReference?: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Lista de platos y cantidades' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
