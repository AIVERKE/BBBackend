import api from './api';

export interface GlobalSummary {
  activeTenants: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface SalesSummary {
  today: {
    total: number;
    count: number;
  };
  month: {
    total: number;
  };
}

export interface TopProduct {
  name: string;
  soldCount: number;
  revenue: number;
}

export interface StaffPerformance {
  name: string;
  ordersProcessed: number;
  totalCollected: number;
}

export interface EndOfDayReport {
  date: string;
  summary: Array<{
    status: string;
    count: number;
    total: number;
  }>;
}

export const analyticsService = {
  async getGlobalSummary(): Promise<GlobalSummary> {
    const response = await api.get('/analytics/global');
    return response.data;
  },

  async getSummary(): Promise<SalesSummary> {
    const response = await api.get('/analytics/summary');
    return response.data;
  },

  async getTopProducts(limit: number = 5): Promise<TopProduct[]> {
    const response = await api.get('/analytics/top-products', { params: { limit } });
    return response.data.map((item: any) => ({
      name: item.name,
      soldCount: Number(item.soldCount) || 0,
      revenue: Number(item.revenue) || 0
    }));
  },

  async getStaffPerformance(): Promise<StaffPerformance[]> {
    const response = await api.get('/analytics/staff-performance');
    return response.data.map((item: any) => ({
      name: item.name,
      ordersProcessed: Number(item.ordersProcessed) || 0,
      totalCollected: Number(item.totalCollected) || 0
    }));
  },

  async getEndOfDayReport(): Promise<EndOfDayReport> {
    const response = await api.get('/analytics/report-end-of-day');
    // Ensure numbers for raw counts
    const normalizedSummary = response.data.summary.map((s: any) => ({
      status: s.status,
      count: Number(s.count) || 0,
      total: Number(s.total) || 0
    }));
    return { ...response.data, summary: normalizedSummary };
  }
};
