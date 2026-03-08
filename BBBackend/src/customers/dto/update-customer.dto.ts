import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({ example: 'juan.perez', description: 'Nombre de usuario', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: '+34 600 000 000', description: 'Teléfono', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 1, description: 'ID del negocio vinculado', required: false })
  @IsNumber()
  @IsOptional()
  tenantId?: number;
}
