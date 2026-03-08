import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Res, NotFoundException, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/database.enum';
import { ConfirmCashPaymentDto } from './dto/confirm-cash-payment.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Response } from 'express';
import { TicketsService } from './tickets.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ticketsService: TicketsService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear un pedido (Cliente)' })
  create(
    @Body() createOrderDto: CreateOrderDto, 
    @CurrentUser() user: any,
    @TenantId() tenantId: number
  ) {
    return this.ordersService.create(createOrderDto, user.id, tenantId);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Listar pedidos pendientes del local (Staff)' })
  findAll(@TenantId() tenantId: number) {
    return this.ordersService.findAllPending(tenantId);
  }

  @Get('my-orders')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar mis pedidos (Cliente)' })
  findAllByCustomer(@CurrentUser() user: any, @TenantId() tenantId: number) {
    return this.ordersService.findAllByCustomer(user.id, tenantId);
  }

  @Get('stats/summary')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Resumen de ventas del día por empleado' })
  getTodayStats(@CurrentUser() user: any, @TenantId() tenantId: number) {
    return this.ordersService.getTodayStats(user.id, tenantId);
  }

  @Get('qr/:qrToken')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Ver detalle de orden por QR' })
  findByToken(@Param('qrToken') qrToken: string, @TenantId() tenantId: number) {
    return this.ordersService.findByToken(qrToken, tenantId);
  }

  @Get(':id/ticket')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Descargar ticket de orden en PDF' })
  async downloadTicket(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @TenantId() tenantId: number,
    @Res() res: Response,
  ) {
    // Buscamos la orden con todas las relaciones necesarias para el ticket
    const order = await this.ordersService.findOneWithDetails(id, tenantId);
    
    // Seguridad: Si es cliente, solo puede ver SU orden.
    // Si es staff/admin, el tenantId ya está filtrado por el decorador.
    if (user.role === UserRole.CUSTOMER && order.customerId !== user.id) {
      throw new ForbiddenException('No tienes permiso para ver este ticket');
    }

    const buffer = await this.ticketsService.generateTicket(order);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=ticket-orden-${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Patch('process-payment/:qrToken')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Procesar pago por QR' })
  processPayment(
    @Param('qrToken') qrToken: string, 
    @CurrentUser() user: any,
    @TenantId() tenantId: number
  ) {
    return this.ordersService.processPayment(qrToken, user.id, tenantId);
  }

  @Post('confirm-cash-payment')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Confirmar pago en efectivo y dar cambio' })
  confirmCashPayment(
    @Body() dto: ConfirmCashPaymentDto, 
    @CurrentUser() user: any,
    @TenantId() tenantId: number
  ) {
    return this.ordersService.confirmCashPayment(dto, user.id, tenantId);
  }

  @Get('admin/list')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Listar todas las órdenes (Admin/SuperUser)' })
  findAllAdmin(@CurrentUser() user: any, @TenantId({ optional: true }) tenantId?: number) {
    const finalTenantId = user.role === UserRole.SUPER_USER ? undefined : tenantId;
    return this.ordersService.findAllAdmin(finalTenantId);
  }

  @Patch('admin/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateOrderDto,
    @CurrentUser() user: any,
    @TenantId({ optional: true }) tenantId?: number
  ) {
    const finalTenantId = user.role === UserRole.SUPER_USER ? undefined : tenantId;
    return this.ordersService.update(id, dto, finalTenantId);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Cancelar orden' })
  cancel(@Param('id', ParseIntPipe) id: number, @TenantId() tenantId: number) {
    return this.ordersService.cancel(id, tenantId);
  }
}
