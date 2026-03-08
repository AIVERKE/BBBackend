import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Optional } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/database.enum';
import { TenantId } from '../common/decorators/tenant-id.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Crear una categoría (Solo Staff de su local)' })
  @ApiResponse({ status: 201, description: 'Categoría creada' })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @TenantId() tenantId: number
  ) {
    return this.categoriesService.create(createCategoryDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías de un local' })
  @ApiQuery({ name: 'tenantId', type: Number, required: false, description: 'Opcional si está logueado como Staff' })
  @ApiResponse({ status: 200, description: 'Lista recuperada' })
  findAll(
    @Query('tenantId') queryTenantId?: number,
    @TenantId({ optional: true }) tokenTenantId?: number
  ) {
    // Si hay token, priorizamos el tenant del token para seguridad
    // Si no, usamos el de la query (vía pública clientes)
    const finalTenantId = tokenTenantId || (queryTenantId ? Number(queryTenantId) : null);
    
    if (!finalTenantId) {
      throw new Error('Tenant ID is required (either via token or query)');
    }
    
    return this.categoriesService.findAll(finalTenantId);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una categoría por ID (De su local)' })
  @ApiResponse({ status: 200, description: 'Encontrada' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @TenantId() tenantId: number
  ) {
    return this.categoriesService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Actualizar una categoría (Solo Staff de su local)' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCategoryDto: UpdateCategoryDto,
    @TenantId() tenantId: number
  ) {
    return this.categoriesService.update(id, updateCategoryDto, tenantId);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar una categoría (Solo Admin de su local)' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TenantId() tenantId: number
  ) {
    return this.categoriesService.remove(id, tenantId);
  }
}
