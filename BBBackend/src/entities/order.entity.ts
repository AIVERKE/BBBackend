import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from './tenant.entity';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { AccountingLedger } from './accounting-ledger.entity';
import { OrderStatus } from '../common/enums/database.enum';

@Entity('orders')
export class Order {
  @ApiProperty({ example: 1, description: 'ID autogenerado del pedido' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID del tenant' })
  @Column({ name: 'tenant_id', type: 'int', nullable: false })
  tenantId: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.orders)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ApiProperty({ example: 1, description: 'ID del cliente que hace el pedido' })
  @Column({ name: 'customer_id', type: 'int', nullable: false })
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ApiProperty({
    example: 2,
    description: 'ID del empleado que escanea el QR y cobra',
    required: false,
  })
  @Column({ name: 'employee_id', type: 'int', nullable: true })
  employeeId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Token único para el QR',
  })
  @Column({ name: 'qr_token', type: 'uuid', unique: true, nullable: false })
  qrToken: string;

  @ApiProperty({ example: 'Mesa 12', description: 'Referencia del pedido (Mesa, Nombre, etc)', required: false })
  @Column({ name: 'order_reference', type: 'varchar', length: 255, nullable: true })
  orderReference: string;

  @ApiProperty({ example: 100.00, description: 'Monto recibido del cliente', required: false })
  @Column({ name: 'amount_received', type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountReceived: number;

  @ApiProperty({ example: 38.00, description: 'Cambio entregado al cliente', required: false })
  @Column({ name: 'change_given', type: 'decimal', precision: 10, scale: 2, nullable: true })
  changeGiven: number;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    description: 'Estado del pedido',
  })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ example: 25.0, description: 'Monto total del pedido' })
  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  totalAmount: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de creación',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @OneToMany(() => AccountingLedger, (ledger) => ledger.order)
  accountingLedgers: AccountingLedger[];
}
