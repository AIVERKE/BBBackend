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
import { Order } from './order.entity';

@Entity('customers')
export class Customer {
  @ApiProperty({ example: 1, description: 'ID autogenerado del cliente' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID del tenant al que pertenece' })
  @Column({ name: 'tenant_id', type: 'int', nullable: false })
  tenantId: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.customers)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ApiProperty({ example: 'johndoe', description: 'Nombre de usuario' })
  @Column({ type: 'varchar', nullable: false })
  username: string;

  @ApiProperty({
    example: '75858809',
    description: 'Número de celular del cliente',
  })
  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @ApiProperty({
    description: 'Hash de la contraseña (oculto en respuestas típicas)',
  })
  @Column({
    name: 'password_hash',
    type: 'varchar',
    nullable: false,
    select: false,
  })
  passwordHash: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de registro',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
