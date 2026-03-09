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

  // Optional fields for creating an initial Admin User alongside the tenant
  @ApiProperty({ example: 'Admin Name', description: 'Name of the first admin', required: false })
  @IsString()
  @IsOptional()
  adminName?: string;

  @ApiProperty({ example: 'admin@business.com', description: 'Email for the first admin', required: false })
  @IsString()
  @IsOptional()
  adminEmail?: string;

  @ApiProperty({ example: 'password123', description: 'Password for the first admin', required: false })
  @IsString()
  @IsOptional()
  adminPassword?: string;
}
