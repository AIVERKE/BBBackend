import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ example: 'SaaS Premium Restobar', description: 'Nombre comercial del negocio' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: true, description: 'Estado de activación', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 'https://example.com/logo.png', description: 'URL del logo', required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;
}
