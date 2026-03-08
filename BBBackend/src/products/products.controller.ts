import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/database.enum';
import { TenantId } from '../common/decorators/tenant-id.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Crear un producto (Solo Staff de su local)' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  create(
    @Body() createProductDto: CreateProductDto,
    @TenantId() tenantId: number
  ) {
    return this.productsService.create(createProductDto, tenantId);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los productos de SU local' })
  @ApiQuery({ name: 'categoryId', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiResponse({ status: 200, description: 'Lista recuperada' })
  findAll(
    @TenantId() tenantId: number,
    @Query('categoryId') categoryId?: number,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(
      tenantId,
      categoryId ? Number(categoryId) : undefined,
      search
    );
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener un producto por ID (Solo de su local)' })
  @ApiResponse({ status: 200, description: 'Encontrado' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @TenantId() tenantId: number
  ) {
    return this.productsService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Actualizar un producto (Solo Staff de su local)' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductDto: UpdateProductDto,
    @TenantId() tenantId: number
  ) {
    return this.productsService.update(id, updateProductDto, tenantId);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un producto (Solo Admin de su local)' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TenantId() tenantId: number
  ) {
    return this.productsService.remove(id, tenantId);
  }
}
