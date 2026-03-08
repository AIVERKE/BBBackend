import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly categoryRepository: Repository<MenuCategory>,
  ) {}

  async create(dto: CreateCategoryDto, tenantId: number): Promise<MenuCategory> {
    const category = this.categoryRepository.create({
      ...dto,
      tenantId,
    });
    return this.categoryRepository.save(category);
  }

  async findAll(tenantId: number): Promise<MenuCategory[]> {
    return this.categoryRepository.find({ where: { tenantId } });
  }

  async findOne(id: number, tenantId: number): Promise<MenuCategory> {
    const category = await this.categoryRepository.findOne({ where: { id, tenantId } });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada en su local`);
    }
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto, tenantId: number): Promise<MenuCategory> {
    const category = await this.findOne(id, tenantId);
    this.categoryRepository.merge(category, dto);
    category.tenantId = tenantId;
    return this.categoryRepository.save(category);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const category = await this.findOne(id, tenantId);
    await this.categoryRepository.remove(category);
  }
}
