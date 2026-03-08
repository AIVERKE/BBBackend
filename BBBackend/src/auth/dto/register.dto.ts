import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, MinLength, IsOptional } from 'class-validator';

export class RegisterCustomerDto {
  @ApiProperty({ example: 'johndoe', description: 'Nombre de usuario único para el cliente' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '75858809', description: 'Número de celular/teléfono' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 1, description: 'ID del restaurante/negocio (tenant)' })
  @IsNotEmpty()
  @IsNumber()
  tenantId: number;
}
