import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { CheckInDto } from './dto/check-in.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async checkIn(dto: CheckInDto, employeeId: number, tenantId: number): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar si ya tiene un check-in activo hoy
    const existing = await this.attendanceRepository.findOne({
      where: { employeeId, date: today, checkOut: IsNull(), tenantId },
    });

    if (existing) {
      throw new BadRequestException('Ya tienes un turno activo hoy.');
    }

    const attendance = this.attendanceRepository.create({
      tenantId, // Forzamos el tenantId del token
      employeeId,
      checkIn: new Date(),
      date: today,
    });

    return this.attendanceRepository.save(attendance);
  }

  async checkOut(employeeId: number, tenantId: number): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await this.attendanceRepository.findOne({
      where: { employeeId, date: today, checkOut: IsNull(), tenantId },
    });

    if (!attendance) {
      throw new NotFoundException('No se encontró un turno activo para finalizar.');
    }

    attendance.checkOut = new Date();
    return this.attendanceRepository.save(attendance);
  }

  async findCurrent(employeeId: number, tenantId: number): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await this.attendanceRepository.findOne({
      where: { employeeId, date: today, checkOut: IsNull(), tenantId },
    });

    if (!attendance) {
      throw new NotFoundException('No tienes un turno activo en este momento.');
    }

    return attendance;
  }

  async findAllAdmin(tenantId?: number): Promise<Attendance[]> {
    const whereClause: any = {};
    if (tenantId) whereClause.tenantId = tenantId;

    return this.attendanceRepository.find({
      where: whereClause,
      relations: ['employee'],
      order: { date: 'DESC', checkIn: 'DESC' },
    });
  }

  async findOne(id: number, tenantId?: number): Promise<Attendance> {
    const whereClause: any = { id };
    if (tenantId) whereClause.tenantId = tenantId;

    const attendance = await this.attendanceRepository.findOne({
      where: whereClause,
      relations: ['employee', 'tenant'],
    });
    if (!attendance) throw new NotFoundException(`Registro de asistencia no encontrado`);
    return attendance;
  }

  async update(id: number, dto: UpdateAttendanceDto, tenantId?: number): Promise<Attendance> {
    const attendance = await this.findOne(id, tenantId);
    this.attendanceRepository.merge(attendance, dto);
    if (tenantId) attendance.tenantId = tenantId;
    return this.attendanceRepository.save(attendance);
  }

  async remove(id: number, tenantId?: number): Promise<void> {
    const attendance = await this.findOne(id, tenantId);
    await this.attendanceRepository.remove(attendance);
  }
}
