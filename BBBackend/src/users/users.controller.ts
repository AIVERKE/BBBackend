import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/database.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Crear un usuario de staff (Solo Admin)' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  create(@Req() req: any, @Body() createUserDto: CreateUserDto) {
    if (req.user.role !== UserRole.SUPER_USER) {
      createUserDto.tenantId = req.user.tenantId;
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Listar usuarios de staff (Solo Admin)' })
  @ApiQuery({ name: 'tenantId', type: Number, required: false })
  findAll(@Req() req: any, @Query('tenantId') tenantId?: number) {
    const filterTenantId = req.user.role === UserRole.SUPER_USER ? (tenantId ? Number(tenantId) : undefined) : req.user.tenantId;
    return this.usersService.findAll(filterTenantId);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Obtener detalle de un usuario (Solo Admin)' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const enforceTenantId = req.user.role === UserRole.SUPER_USER ? undefined : req.user.tenantId;
    return this.usersService.findOne(id, enforceTenantId);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Actualizar un usuario (Solo Admin)' })
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    if (req.user.role !== UserRole.SUPER_USER && updateUserDto.tenantId && updateUserDto.tenantId !== req.user.tenantId) {
       throw new ForbiddenException('Cannot change user to a different tenant');
    }
    const enforceTenantId = req.user.role === UserRole.SUPER_USER ? undefined : req.user.tenantId;
    return this.usersService.update(id, updateUserDto, enforceTenantId);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un usuario (Solo Admin/SuperUser)' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const enforceTenantId = req.user.role === UserRole.SUPER_USER ? undefined : req.user.tenantId;
    return this.usersService.remove(id, enforceTenantId);
  }
}
