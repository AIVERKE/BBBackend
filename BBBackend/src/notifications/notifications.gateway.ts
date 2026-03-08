import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Intentamos obtener el token del handshake (query o headers)
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} disconnected: No token provided`);
        client.disconnect();
        return;
      }

      // Validamos el token
      const payload = await this.jwtService.verifyAsync(token);
      
      // Adjuntamos el usuario al socket para uso futuro
      client.data.user = payload;

      // Unimos al usuario automáticamente a la sala de su tenant
      const tenantRoom = `tenant_${payload.tenantId}`;
      client.join(tenantRoom);

      this.logger.log(`Client ${client.id} authenticated. Joined room: ${tenantRoom}`);
    } catch (error) {
      this.logger.warn(`Client ${client.id} disconnected: Invalid token`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Envía una notificación de nuevo pedido a todos los empleados del local.
   */
  notifyNewOrder(tenantId: number, orderData: any) {
    const room = `tenant_${tenantId}`;
    this.server.to(room).emit('new_order', {
      message: '¡Nuevo pedido recibido!',
      order: orderData,
    });
  }

  /**
   * Notifica un cambio en el estado de un pedido.
   */
  notifyOrderStatusUpdate(tenantId: number, orderId: number, status: string) {
    const room = `tenant_${tenantId}`;
    this.server.to(room).emit('order_status_updated', {
      orderId,
      status,
    });
  }
}
