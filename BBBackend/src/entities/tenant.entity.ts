import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Customer } from './customer.entity';
import { Attendance } from './attendance.entity';
import { MenuCategory } from './menu-category.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { AccountingLedger } from './accounting-ledger.entity';

@Entity('tenants')
export class Tenant {
  @ApiProperty({ example: 1, description: 'ID autogenerado del tenant' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'My Business Name',
    description: 'Nombre comercial del tenant',
  })
  @Column({ name: 'business_name', type: 'varchar', nullable: false })
  businessName: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'URL del logo del negocio',
    required: false,
  })
  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl: string;

  @ApiProperty({
    example: true,
    description: 'Estado de activación del tenant',
    default: true,
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

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

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Customer, (customer) => customer.tenant)
  customers: Customer[];

  @OneToMany(() => Attendance, (attendance) => attendance.tenant)
  attendances: Attendance[];

  @OneToMany(() => MenuCategory, (category) => category.tenant)
  menuCategories: MenuCategory[];

  @OneToMany(() => Product, (product) => product.tenant)
  products: Product[];

  @OneToMany(() => Order, (order) => order.tenant)
  orders: Order[];

  @OneToMany(() => AccountingLedger, (ledger) => ledger.tenant)
  accountingLedgers: AccountingLedger[];
}
