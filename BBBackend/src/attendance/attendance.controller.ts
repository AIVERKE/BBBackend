import { Controller, Post, Patch, Get, Body, UseGuards, Query, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/database.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TenantId } from '../common/decorators/tenant-id.decorator';

@ApiTags('attendance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Iniciar turno (Check-in)' })
  @ApiResponse({ status: 201, description: 'Turno iniciado con éxito' })
  checkIn(@Body() dto: CheckInDto, @CurrentUser() user: any, @TenantId() tenantId: number) {
    return this.attendanceService.checkIn(dto, user.id, tenantId);
  }

  @Patch('check-out')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Finalizar turno (Check-out)' })
  @ApiResponse({ status: 200, description: 'Turno finalizado con éxito' })
  checkOut(@CurrentUser() user: any, @TenantId() tenantId: number) {
    return this.attendanceService.checkOut(user.id, tenantId);
  }

  @Get('current')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Obtener el turno activo del empleado logueado' })
  @ApiResponse({ status: 200, description: 'Información del turno' })
  findCurrent(@CurrentUser() user: any, @TenantId() tenantId: number) {
    return this.attendanceService.findCurrent(user.id, tenantId);
  }

  @Get('admin/list')
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Listar registros de asistencia (Solo Admin de su local)' })
  findAllAdmin(@CurrentUser() user: any, @TenantId({ optional: true }) tenantId?: number) {
    const finalTenantId = user.role === UserRole.SUPER_USER ? undefined : tenantId;
    return this.attendanceService.findAllAdmin(finalTenantId);
  }

  @Get('admin/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Obtener un registro de asistencia por ID (Solo de su local)' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any, @TenantId({ optional: true }) tenantId?: number) {
    const finalTenantId = user.role === UserRole.SUPER_USER ? undefined : tenantId;
    return this.attendanceService.findOne(id, finalTenantId);
  }

  @Patch('admin/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Actualizar registro de asistencia (Solo Admin de su local)' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateAttendanceDto,
    @CurrentUser() user: any,
    @TenantId({ optional: true }) tenantId?: number
  ) {
    const finalTenantId = user.role === UserRole.SUPER_USER ? undefined : tenantId;
    return this.attendanceService.update(id, dto, finalTenantId);
  }

  @Delete('admin/:id')
  @Roles(UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Eliminar registro de asistencia (Solo SuperUser)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}
