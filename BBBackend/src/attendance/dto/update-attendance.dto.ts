import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAttendanceDto {
  @ApiProperty({ example: '2023-01-01', required: false })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: '2023-01-01T08:00:00.000Z', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  checkIn?: Date;

  @ApiProperty({ example: '2023-01-01T17:00:00.000Z', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  checkOut?: Date;
}
