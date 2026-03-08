import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'El correo electrónico del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'mypassword123',
    description: 'La contraseña del usuario',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class LoginCustomerDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'El nombre de usuario del cliente',
  })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiProperty({
    example: 'mypassword123',
    description: 'La contraseña del cliente',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
