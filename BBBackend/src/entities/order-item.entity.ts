import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ example: 1, description: 'ID autogenerado del item' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID del pedido al que pertenece' })
  @Column({ name: 'order_id', type: 'int', nullable: false })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({ example: 1, description: 'ID del producto' })
  @Column({ name: 'product_id', type: 'int', nullable: false })
  productId: number;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ example: 2, description: 'Cantidad comprada' })
  @Column({ type: 'int', default: 1, nullable: false })
  quantity: number;

  @ApiProperty({
    example: 12.5,
    description: 'Precio unitario al momento de la compra',
  })
  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  unitPrice: number;

  @ApiProperty({
    example: 25.0,
    description: 'Subtotal (cantidad * unit_price)',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subtotal: number;
}
