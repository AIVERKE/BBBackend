import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../common/enums/database.enum';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { OrderStatsDto } from './dto/order-stats.dto';
import { ConfirmCashPaymentDto } from './dto/confirm-cash-payment.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(dto: CreateOrderDto, customerId: number, tenantId: number): Promise<any> {
    const finalTenantId = tenantId;

    return this.dataSource.transaction(async (manager) => {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const item of dto.items) {
        const product = await manager.findOne(Product, { where: { id: item.productId, tenantId: finalTenantId } });
        if (!product) {
          throw new NotFoundException(`Producto con ID ${item.productId} no encontrado en su local`);
        }

        const subtotal = Number(product.price) * item.quantity;
        totalAmount += subtotal;

        const orderItem = manager.create(OrderItem, {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal,
        });
        orderItems.push(orderItem);
      }

      const serviceFee = totalAmount * 0.10;
      const finalTotal = totalAmount + serviceFee;

      const order = manager.create(Order, {
        tenantId: finalTenantId,
        customerId,
        totalAmount: finalTotal,
        qrToken: uuidv4(),
        orderReference: dto.orderReference,
      });

      const savedOrder = await manager.save(Order, order);

      for (const item of orderItems) {
        item.orderId = savedOrder.id;
        await manager.save(OrderItem, item);
      }

      const qrImage = await QRCode.toDataURL(savedOrder.qrToken);

      this.notificationsGateway.notifyNewOrder(finalTenantId, savedOrder);

      return {
        ...savedOrder,
        qrImage,
      };
    });
  }

  async findAllByCustomer(customerId: number, tenantId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId, tenantId },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, customerId: number, tenantId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, customerId, tenantId },
      relations: ['orderItems', 'orderItems.product', 'tenant'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado en su local`);
    }

    return order;
  }

  async processPayment(qrToken: string, employeeId: number, tenantId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { qrToken, tenantId },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con token QR ${qrToken} no encontrado en su local`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(`El pedido no está en estado PENDIENTE`);
    }

    order.status = OrderStatus.PAID;
    order.employeeId = employeeId;

    const savedOrder = await this.orderRepository.save(order);
    this.notificationsGateway.notifyOrderStatusUpdate(tenantId, order.id, order.status);
    return savedOrder;
  }

  async findByToken(qrToken: string, tenantId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { qrToken, tenantId },
      relations: ['orderItems', 'orderItems.product', 'customer'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con token QR ${qrToken} no encontrado en su local`);
    }

    return order;
  }

  async findAllPending(tenantId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { tenantId, status: OrderStatus.PENDING },
      relations: ['customer'],
      order: { createdAt: 'ASC' },
    });
  }

  async getTodayStats(employeeId: number, tenantId: number): Promise<OrderStatsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.orderRepository.count({
      where: {
        employeeId,
        tenantId,
        status: OrderStatus.PAID,
        createdAt: Between(today, tomorrow),
      },
    });

    return {
      ordersCount: count,
      percentageChange: 12,
    };
  }

  async confirmCashPayment(dto: ConfirmCashPaymentDto, employeeId: number, tenantId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { qrToken: dto.qrToken, tenantId },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con token QR ${dto.qrToken} no encontrado en su local`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(`El pedido no está en estado PENDIENTE`);
    }

    if (dto.amountReceived < Number(order.totalAmount)) {
      throw new BadRequestException(`Monto insuficiente`);
    }

    order.status = OrderStatus.PAID;
    order.employeeId = employeeId;
    order.amountReceived = dto.amountReceived;
    order.changeGiven = dto.amountReceived - Number(order.totalAmount);

    const savedOrder = await this.orderRepository.save(order);
    this.notificationsGateway.notifyOrderStatusUpdate(tenantId, order.id, order.status);
    return savedOrder;
  }

  async cancel(id: number, tenantId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id, tenantId } });
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada en su local`);
    }
    
    if (order.status === OrderStatus.PAID) {
      throw new BadRequestException('No se puede cancelar una orden ya pagada');
    }

    order.status = OrderStatus.CANCELLED;
    const savedOrder = await this.orderRepository.save(order);
    this.notificationsGateway.notifyOrderStatusUpdate(tenantId, order.id, order.status);
    return savedOrder;
  }

  async findAllAdmin(tenantId?: number): Promise<Order[]> {
    const whereClause: any = {};
    if (tenantId) whereClause.tenantId = tenantId;

    return this.orderRepository.find({
      where: whereClause,
      relations: ['customer', 'employee', 'tenant', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneAdmin(id: number, tenantId?: number): Promise<Order> {
    const whereClause: any = { id };
    if (tenantId) whereClause.tenantId = tenantId;

    const order = await this.orderRepository.findOne({
      where: whereClause,
      relations: ['customer', 'employee', 'tenant', 'orderItems', 'orderItems.product'],
    });

    if (!order) throw new NotFoundException(`Orden no encontrada`);
    return order;
  }

  async update(id: number, dto: UpdateOrderDto, tenantId?: number): Promise<Order> {
    const order = await this.findOneAdmin(id, tenantId);
    this.orderRepository.merge(order, dto);
    if (tenantId) order.tenantId = tenantId;
    return this.orderRepository.save(order);
  }

  async findOneWithDetails(id: number, tenantId?: number): Promise<Order> {
    const whereClause: any = { id };
    if (tenantId) whereClause.tenantId = tenantId;

    const order = await this.orderRepository.findOne({
      where: whereClause,
      relations: ['customer', 'tenant', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return order;
  }
}
