import api from './api';

export interface OrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  tenantId: number;
  orderReference?: string;
  items: OrderItemDto[];
}

export interface OrderResponse {
  id: number;
  tenantId: number;
  customerId: number;
  totalAmount: number;
  status: string;
  qrToken: string;
  qrImage: string; // Base64 image
  orderReference?: string;
  createdAt: string;
}

export interface OrderStatsDto {
  ordersCount: number;
  percentageChange: number;
}

export interface ConfirmCashPaymentDto {
  qrToken: string;
  amountReceived: number;
}

export const orderService = {
  /**
   * Send a new order request to the backend.
   * Based on OrdersController POST /orders
   */
  async createOrder(data: CreateOrderDto): Promise<OrderResponse> {
    try {
      const response = await api.post('/orders', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  /**
   * Retrieves an order's data including the QR Token to render the success view again if needed.
   * Based on OrdersController GET /orders/my-orders (Or by looking up specific logic if available)
   */
  async getMyOrders(tenantId: number): Promise<OrderResponse[]> {
    try {
      const response = await api.get('/orders/my-orders', { params: { tenantId }});
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  // --- Employee / Admin Methods ---

  async getPendingOrders(tenantId: number): Promise<OrderResponse[]> {
    try {
      // tenantId is technically handled by decorator in backend if user is staff,
      // but passing it as param if required by backend interceptors is safe.
      const response = await api.get('/orders', { params: { tenantId } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending orders:', error);
      throw error;
    }
  },

  async getTodayStats(tenantId: number): Promise<OrderStatsDto> {
    try {
      const response = await api.get('/orders/stats/summary', { params: { tenantId } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order stats:', error);
      throw error;
    }
  },

  async confirmCashPayment(data: ConfirmCashPaymentDto): Promise<OrderResponse> {
    try {
      const response = await api.post('/orders/confirm-cash-payment', data);
      return response.data;
    } catch (error) {
      console.error('Failed to confirm cash payment:', error);
      throw error;
    }
  }
};
