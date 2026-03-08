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
import { UserRole } from '../common/enums/database.enum';
import { Tenant } from './tenant.entity';
import { Attendance } from './attendance.entity';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'ID autogenerado del usuario' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID del tenant al que pertenece' })
  @Column({ name: 'tenant_id', type: 'int', nullable: true })
  tenantId: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN,
    description: 'Rol del usuario',
  })
  @Column({ type: 'enum', enum: UserRole, nullable: false })
  role: UserRole;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  @Column({ name: 'full_name', type: 'varchar', nullable: false })
  fullName: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Correo electrónico único',
  })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

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

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];

  @OneToMany(() => Order, (order) => order.employee)
  orders: Order[];
}
