import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { RegisterCustomerDto } from '../auth/dto/register.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(dto: RegisterCustomerDto): Promise<Customer> {
    const existing = await this.customerRepository.findOne({ where: { username: dto.username } });
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const customer = this.customerRepository.create({
      ...dto,
      passwordHash,
    });

    return this.customerRepository.save(customer);
  }

  async findAll(tenantId?: number): Promise<Customer[]> {
    if (tenantId) {
      return this.customerRepository.find({ where: { tenantId } });
    }
    return this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findByUsername(username: string): Promise<Customer | null> {
    return this.customerRepository.createQueryBuilder('customer')
      .where('customer.username = :username', { username })
      .addSelect('customer.passwordHash')
      .getOne();
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    this.customerRepository.merge(customer, dto);
    return this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
}
