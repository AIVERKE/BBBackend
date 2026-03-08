import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { OrderStatus } from '../../common/enums/database.enum';

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PAID, required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ example: 'Mesa 05', required: false })
  @IsString()
  @IsOptional()
  orderReference?: string;

  @ApiProperty({ example: 1, description: 'ID del empleado que procesa', required: false })
  @IsNumber()
  @IsOptional()
  employeeId?: number;

  @ApiProperty({ example: 100.00, required: false })
  @IsNumber()
  @IsOptional()
  amountReceived?: number;

  @ApiProperty({ example: 38.00, required: false })
  @IsNumber()
  @IsOptional()
  changeGiven?: number;
}
