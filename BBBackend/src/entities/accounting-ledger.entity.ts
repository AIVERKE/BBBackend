import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from './tenant.entity';
import { Order } from './order.entity';

@Entity('accounting_ledgers')
export class AccountingLedger {
  @ApiProperty({
    example: 1,
    description: 'ID autogenerado del registro contable',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID del tenant' })
  @Column({ name: 'tenant_id', type: 'int', nullable: false })
  tenantId: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.accountingLedgers)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ApiProperty({
    example: 1,
    description: 'ID del pedido asociado, si aplica',
    required: false,
  })
  @Column({ name: 'order_id', type: 'int', nullable: true })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.accountingLedgers)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({
    example: 'income',
    description: 'Tipo de transacción: income o expense',
  })
  @Column({ name: 'transaction_type', type: 'varchar', nullable: false })
  transactionType: string;

  @ApiProperty({
    example: 'Venta de pedido #1',
    description: 'Concepto de la transacción',
  })
  @Column({ type: 'varchar', nullable: false })
  concept: string;

  @ApiProperty({ example: 25.0, description: 'Monto de la transacción' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de la transacción',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
