import api from './api';

export interface User {
  id: number;
  tenantId: number | null;
  role: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface CreateUserDto {
  tenantId?: number;
  role: string;
  fullName: string;
  email: string;
  password?: string; // Optional if we generate it or handle it separately, but required for creation initially
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  role?: string;
}

export const usersService = {
  /**
   * Fetch all users, optionally filtered by tenantId
   */
  async getUsers(tenantId?: number): Promise<User[]> {
    const params = tenantId ? { tenantId } : {};
    const response = await api.get('/users', { params });
    return response.data;
  },

  /**
   * Create a new user account (e.g. Employee)
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const response = await api.post('/users', data);
    return response.data;
  },

  /**
   * Update an existing user account
   */
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user account
   */
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
