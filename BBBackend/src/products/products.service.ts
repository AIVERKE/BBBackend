import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto, tenantId: number): Promise<Product> {
    const product = this.productRepository.create({
      ...dto,
      tenantId, // Forzamos el tenantId desde el token
    });
    return this.productRepository.save(product);
  }

  async findAll(tenantId: number, categoryId?: number, search?: string): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.tenantId = :tenantId', { tenantId });

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      query.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${search}%` });
    }

    return query.getMany();
  }

  async findOne(id: number, tenantId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id, tenantId },
      relations: ['category']
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado en su local`);
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto, tenantId: number): Promise<Product> {
    const product = await this.findOne(id, tenantId); // findOne ya valida el tenantId
    this.productRepository.merge(product, dto);
    // Aseguramos que el tenantId no se cambie vía DTO
    product.tenantId = tenantId;
    return this.productRepository.save(product);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const product = await this.findOne(id, tenantId);
    await this.productRepository.remove(product);
  }
}
