import { ApiProperty } from '@nestjs/swagger';

export class OrderStatsDto {
  @ApiProperty({ example: 42, description: 'Número total de órdenes cobradas hoy por el empleado' })
  ordersCount: number;

  @ApiProperty({ example: 12, description: 'Porcentaje de cambio respecto al día/periodo anterior', required: false })
  percentageChange?: number;
}
