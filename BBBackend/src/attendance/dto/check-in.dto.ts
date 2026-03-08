import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckInDto {
  @ApiProperty({ example: 1, description: 'ID del negocio (tenant)' })
  @IsNumber()
  @IsNotEmpty()
  tenantId: number;
}
