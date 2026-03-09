import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/enums/database.enum';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateTenantDto): Promise<Tenant> {
    const tenant = this.tenantRepository.create({
      businessName: dto.businessName,
      isActive: dto.isActive,
      logoUrl: dto.logoUrl,
    });
    const savedTenant = await this.tenantRepository.save(tenant);

    if (dto.adminEmail && dto.adminPassword) {
      // Create associated admin user
      await this.usersService.create({
        email: dto.adminEmail,
        password: dto.adminPassword,
        fullName: dto.adminName || 'Admin ' + savedTenant.businessName,
        role: UserRole.ADMIN,
        tenantId: savedTenant.id,
      });
    }

    return savedTenant;
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  async findOne(id: number): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async update(id: number, dto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    this.tenantRepository.merge(tenant, dto);
    return this.tenantRepository.save(tenant);
  }

  async remove(id: number): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantRepository.remove(tenant);
  }
}
