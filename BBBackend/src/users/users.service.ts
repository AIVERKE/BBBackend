import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({
      ...dto,
      passwordHash,
    });

    const savedUser = await this.userRepository.save(user);
    delete (savedUser as any).passwordHash;
    return savedUser;
  }

  async findAll(tenantId?: number): Promise<User[]> {
    if (tenantId) {
      return this.userRepository.find({ where: { tenantId } });
    }
    return this.userRepository.find();
  }

  async findOne(id: number, tenantId?: number): Promise<User> {
    const where: any = { id };
    if (tenantId) {
      where.tenantId = tenantId;
    }
    const user = await this.userRepository.findOne({ where });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.passwordHash')
      .getOne();
  }

  async update(id: number, dto: UpdateUserDto, tenantId?: number): Promise<User> {
    const user = await this.findOne(id, tenantId);
    this.userRepository.merge(user, dto);
    const updatedUser = await this.userRepository.save(user);
    delete (updatedUser as any).passwordHash;
    return updatedUser;
  }

  async remove(id: number, tenantId?: number): Promise<void> {
    const user = await this.findOne(id, tenantId);
    await this.userRepository.remove(user);
  }
}
