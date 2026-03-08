import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfirmCashPaymentDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Token QR de la orden' })
  @IsString()
  @IsNotEmpty()
  qrToken: string;

  @ApiProperty({ example: 100.00, description: 'Monto entregado por el cliente' })
  @IsNumber()
  @IsNotEmpty()
  amountReceived: number;
}
