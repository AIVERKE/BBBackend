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
import { Product } from './product.entity';

@Entity('menu_categories')
export class MenuCategory {
  @ApiProperty({ example: 1, description: 'ID autogenerado de la categoría' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID del tenant' })
  @Column({ name: 'tenant_id', type: 'int', nullable: false })
  tenantId: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.menuCategories)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ApiProperty({ example: 'Pizzas', description: 'Nombre de la categoría' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: 'Pizzas a la piedra',
    description: 'Descripción de la categoría',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
