import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateAccountingLedgerDto {
  @ApiProperty({ example: 1, description: 'ID del negocio' })
  @IsNumber()
  @IsNotEmpty()
  tenantId: number;

  @ApiProperty({ example: 1, description: 'ID del pedido asociado', required: false })
  @IsNumber()
  @IsOptional()
  orderId?: number;

  @ApiProperty({ example: 'income', description: 'Tipo: income o expense' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['income', 'expense'])
  transactionType: string;

  @ApiProperty({ example: 'Venta de pedido #1', description: 'Concepto' })
  @IsString()
  @IsNotEmpty()
  concept: string;

  @ApiProperty({ example: 25.0, description: 'Monto' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
