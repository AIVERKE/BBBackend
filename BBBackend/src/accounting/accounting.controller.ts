import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { CreateAccountingLedgerDto } from './dto/create-accounting-ledger.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/database.enum';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('accounting')
@Controller('accounting')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Registrar un movimiento contable (Solo Admin de su local)' })
  create(@Body() dto: CreateAccountingLedgerDto, @TenantId() tenantId: number) {
    return this.accountingService.create(dto, tenantId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Listar movimientos contables (Solo Admin de su local)' })
  findAll(@CurrentUser() user: any, @TenantId({ optional: true }) tenantId?: number) {
    const finalTenantId = user.role === UserRole.SUPER_USER ? undefined : tenantId;
    return this.accountingService.findAll(finalTenantId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Obtener detalle de un movimiento contable (Solo de su local)' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any, @TenantId({ optional: true }) tenantId?: number) {
    const finalTenantId = user.role === UserRole.SUPER_USER ? undefined : tenantId;
    return this.accountingService.findOne(id, finalTenantId);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Eliminar un registro contable (Solo SuperUser)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accountingService.remove(id);
  }
}
