import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/database.enum';
import { TenantId } from '../common/decorators/tenant-id.decorator';

@ApiTags('analytics')
@Controller('analytics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Resumen de ventas diario y mensual (Solo Admin)' })
  getSummary(@TenantId() tenantId: number) {
    return this.analyticsService.getSalesSummary(tenantId);
  }

  @Get('top-products')
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Ranking de los productos más vendidos (Solo Admin)' })
  getTopProducts(@TenantId() tenantId: number, @Query('limit') limit?: number) {
    return this.analyticsService.getTopProducts(tenantId, limit);
  }

  @Get('staff-performance')
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Métricas de desempeño por empleado (Solo Admin)' })
  getStaff(@TenantId() tenantId: number) {
    return this.analyticsService.getStaffPerformance(tenantId);
  }

  @Get('report-end-of-day')
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Reporte consolidado de cierre de caja (Solo Admin)' })
  getReport(@TenantId() tenantId: number) {
    return this.analyticsService.getEndOfDayReport(tenantId);
  }
}
