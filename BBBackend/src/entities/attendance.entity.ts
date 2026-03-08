import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Entity('attendances')
export class Attendance {
  @ApiProperty({ example: 1, description: 'ID autogenerado de la asistencia' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 1, description: 'ID del tenant' })
  @Column({ name: 'tenant_id', type: 'int', nullable: false })
  tenantId!: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.attendances)
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @ApiProperty({ example: 1, description: 'ID del empleado (usuario)' })
  @Column({ name: 'employee_id', type: 'int', nullable: false })
  employeeId!: number;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee!: User;

  @ApiProperty({
    example: '2023-01-01T08:00:00.000Z',
    description: 'Hora de entrada',
  })
  @Column({ name: 'check_in', type: 'timestamp', nullable: false })
  checkIn!: Date;

  @ApiProperty({
    example: '2023-01-01T17:00:00.000Z',
    description: 'Hora de salida',
  })
  @Column({ name: 'check_out', type: 'timestamp', nullable: true })
  checkOut!: Date;

  @ApiProperty({ example: '2023-01-01', description: 'Fecha de la asistencia' })
  @Column({ type: 'date', nullable: false })
  date!: string;
}
