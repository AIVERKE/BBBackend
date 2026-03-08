import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountingLedger } from '../entities/accounting-ledger.entity';
import { CreateAccountingLedgerDto } from './dto/create-accounting-ledger.dto';

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(AccountingLedger)
    private readonly ledgerRepository: Repository<AccountingLedger>,
  ) {}

  async create(dto: CreateAccountingLedgerDto, tenantId: number): Promise<AccountingLedger> {
    const entry = this.ledgerRepository.create({
      ...dto,
      tenantId,
    });
    return this.ledgerRepository.save(entry);
  }

  async findAll(tenantId?: number): Promise<AccountingLedger[]> {
    const whereClause: any = {};
    if (tenantId) whereClause.tenantId = tenantId;

    return this.ledgerRepository.find({
      where: whereClause,
      relations: tenantId ? ['order'] : ['tenant', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, tenantId?: number): Promise<AccountingLedger> {
    const whereClause: any = { id };
    if (tenantId) whereClause.tenantId = tenantId;

    const entry = await this.ledgerRepository.findOne({
      where: whereClause,
      relations: ['tenant', 'order'],
    });
    if (!entry) throw new NotFoundException(`Movimiento contable no encontrado`);
    return entry;
  }

  async remove(id: number, tenantId?: number): Promise<void> {
    const entry = await this.findOne(id, tenantId);
    await this.ledgerRepository.remove(entry);
  }
}
