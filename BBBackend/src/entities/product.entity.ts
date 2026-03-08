import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from './tenant.entity';
import { MenuCategory } from './menu-category.entity';
import { OrderItem } from './order-item.entity';

@Entity('products')
export class Product {
  @ApiProperty({ example: 1, description: 'ID autogenerado del producto' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 1, description: 'ID del tenant' })
  @Column({ name: 'tenant_id', type: 'int', nullable: false })
  tenantId!: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.products)
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @ApiProperty({ example: 1, description: 'ID de la categoría' })
  @Column({ name: 'category_id', type: 'int', nullable: false })
  categoryId!: number;

  @ManyToOne(() => MenuCategory, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category!: MenuCategory;

  @ApiProperty({
    example: 'Pizza Margherita',
    description: 'Nombre del producto',
  })
  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @ApiProperty({
    example: 'Deliciosa pizza con queso mozzarella',
    description: 'Descripción del producto',
  })
  @Column({ type: 'text', nullable: true })
  description!: string;

  @ApiProperty({ example: 12.5, description: 'Precio del producto' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price!: number;

  @ApiProperty({ example: true, description: 'Si el producto está disponible' })
  @Column({ name: 'is_available', type: 'boolean', default: true })
  isAvailable!: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];
}
