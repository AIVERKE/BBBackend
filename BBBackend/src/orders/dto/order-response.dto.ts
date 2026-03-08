import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../entities/order.entity';

export class OrderResponseDto extends Order {
  @ApiProperty({ description: 'Imagen del código QR en formato Base64', example: 'data:image/png;base64,...' })
  qrImage: string;
}
