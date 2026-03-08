import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // Adjust if your backend port is different

export const authService = {
  async loginCustomer(username, password) {
    try {
      const response = await axios.post(`${API_URL}`, {
        username,
        password,
      });
      if (response.data.access_token || response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getTenants() {
    try {
      // Assuming the tenants endpoint is at http://localhost:3000/tenants
      const response = await axios.get('http://localhost:3000/tenants');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
      throw error;
    }
  },

  async registerCustomer(data: { username: string, password: string, phone: string, tenantId: number }) {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async loginUser(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data.access_token || response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
};
