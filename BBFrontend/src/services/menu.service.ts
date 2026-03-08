import api from './api';

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  tenantId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  tenantId: number;
  imageUrl?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  tenantId: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export const menuService = {
  /**
   * Fetch all categories for the authenticated tenant.
   * Based on CategoriesController GET /categories
   */
  async getCategories(tenantId?: number): Promise<Category[]> {
    try {
      const params = tenantId ? { tenantId } : {};
      const response = await api.get('/categories', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  /**
   * Fetch all products for the authenticated tenant.
   * Can be filtered by categoryId.
   * Based on ProductsController GET /products
   */
  async getProducts(categoryId?: number, search?: string): Promise<Product[]> {
    try {
      const params: any = {};
      if (categoryId) params.categoryId = categoryId;
      if (search) params.search = search;
      
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  // --- Admin Product CRUD ---

  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      const response = await api.post('/products', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  async updateProduct(id: number, data: UpdateProductDto): Promise<Product> {
    try {
      const response = await api.patch(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw error;
    }
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  }
};
