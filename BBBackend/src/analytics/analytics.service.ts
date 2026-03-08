import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../common/enums/database.enum';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getSalesSummary(tenantId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Ventas de hoy
    const todaySales = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .addSelect('COUNT(order.id)', 'count')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .andWhere('order.createdAt BETWEEN :start AND :end', { start: today, end: tomorrow })
      .getRawOne();

    // Ventas del mes
    const monthSales = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .andWhere('order.createdAt >= :start', { start: monthStart })
      .getRawOne();

    return {
      today: {
        total: parseFloat(todaySales.total) || 0,
        count: parseInt(todaySales.count) || 0,
      },
      month: {
        total: parseFloat(monthSales.total) || 0,
      }
    };
  }

  async getTopProducts(tenantId: number, limit = 5) {
    const parsedLimit = parseInt(limit as any, 10) || 5;
    return this.orderItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.product', 'product')
      .innerJoin('item.order', 'order')
      .select('product.name', 'name')
      .addSelect('SUM(item.quantity)', 'soldCount')
      .addSelect('SUM(item.subtotal)', 'revenue')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .orderBy('"soldCount"', 'DESC')
      .limit(parsedLimit)
      .getRawMany();
  }

  async getStaffPerformance(tenantId: number) {
    return this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.employee', 'employee')
      .select('employee.fullName', 'name')
      .addSelect('COUNT(order.id)', 'ordersProcessed')
      .addSelect('SUM(order.totalAmount)', 'totalCollected')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .groupBy('employee.id')
      .addGroupBy('employee.fullName')
      .orderBy('"totalCollected"', 'DESC')
      .getRawMany();
  }

  async getEndOfDayReport(tenantId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(order.totalAmount)', 'total')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.createdAt BETWEEN :start AND :end', { start: today, end: tomorrow })
      .groupBy('order.status')
      .getRawMany();

    return {
      date: today.toISOString().split('T')[0],
      summary: stats,
    };
  }
}
