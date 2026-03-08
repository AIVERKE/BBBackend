import { Controller, Post, Body, Get, UnauthorizedException, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginUserDto, LoginCustomerDto } from './dto/login.dto';
import { RegisterCustomerDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión como personal (Staff) vía email' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async loginUser(@Body() body: LoginUserDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.loginUser(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiOperation({ summary: 'Iniciar sesión como cliente (Customer) vía nombre de usuario' })
  @ApiBody({ type: LoginCustomerDto })
  @ApiResponse({ status: 200, description: 'Login exitoso con información de rol' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async loginCustomer(@Body() body: LoginCustomerDto) {
    const customer = await this.authService.validateCustomer(body.username, body.password);
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.loginCustomer(customer);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiBody({ type: RegisterCustomerDto })
  @ApiResponse({ status: 201, description: 'Cliente creado con éxito' })
  @ApiResponse({ status: 409, description: 'El nombre de usuario ya existe' })
  async register(@Body() registerDto: RegisterCustomerDto) {
    return this.authService.registerCustomer(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @ApiOperation({ summary: 'Obtener el perfil del usuario/cliente actual' })
  @ApiResponse({ status: 200, description: 'Perfil recuperado con éxito' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
