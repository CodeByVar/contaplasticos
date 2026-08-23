import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export enum ScrapCause {
  ARRANQUE_MAQUINA = 'ARRANQUE_MAQUINA',
  CAMBIO_COLOR = 'CAMBIO_COLOR',
  ATASCO = 'ATASCO',
  DESCALIBRACION = 'DESCALIBRACION',
}

export class CreateScrapDto {
  @IsUUID()
  productionOrderId!: string;

  @IsOptional()
  @IsUUID()
  materialId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  consumedRawMaterialKg!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  producedGoodKg!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  scrapRecoverableKg!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  scrapDiscardKg!: number;

  @IsEnum(ScrapCause)
  cause!: ScrapCause;

  @IsOptional()
  @IsString()
  notes?: string;
}
