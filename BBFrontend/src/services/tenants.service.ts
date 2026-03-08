import api from './api';

export interface Tenant {
  id: number;
  businessName: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateTenantDto {
  businessName?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export const tenantsService = {
  /**
   * Fetch tenant details by ID
   */
  async getTenant(id: number): Promise<Tenant> {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  },

  /**
   * Update tenant information
   */
  async updateTenant(id: number, data: UpdateTenantDto): Promise<Tenant> {
    const response = await api.patch(`/tenants/${id}`, data);
    return response.data;
  },

  /**
   * List all tenants (mainly for registration/superadmin)
   */
  async getTenants(): Promise<Tenant[]> {
    const response = await api.get('/tenants');
    return response.data;
  },

  /**
   * Upload tenant logo
   */
  async uploadLogo(file: File): Promise<{ fileName: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
