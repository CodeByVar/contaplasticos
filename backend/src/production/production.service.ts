import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScrapDto } from './dto/create-scrap.dto';

@Injectable()
export class ProductionService {
  constructor(private readonly prisma: PrismaService) {}

  async registerScrap(data: CreateScrapDto, operatorId: string) {
    const totalOutput = data.producedGoodKg + data.scrapRecoverableKg + data.scrapDiscardKg;
    if (data.consumedRawMaterialKg < totalOutput) {
      throw new BadRequestException('El consumo no puede ser menor que la produccion y la merma registrada');
    }

    const request = await this.prisma.productionRequest.findUnique({
      where: { id: data.productionOrderId },
      include: { materials: true },
    });
    if (!request) throw new NotFoundException('Orden de produccion no encontrada');
    if (request.status !== 'APROBADA' && request.status !== 'COMPLETADA') {
      throw new BadRequestException('La orden debe estar aprobada antes de registrar consumo');
    }

    const scrapPercentage = data.consumedRawMaterialKg === 0
      ? 0
      : ((data.scrapRecoverableKg + data.scrapDiscardKg) / data.consumedRawMaterialKg) * 100;

    return this.prisma.$transaction(async (transaction) => {
      const record = await transaction.scrapRecord.create({
        data: {
          productionRequestId: request.id,
          materialId: data.materialId,
          rawMaterialUsedKg: data.consumedRawMaterialKg,
          finishedProductKg: data.producedGoodKg,
          recoverableScrapKg: data.scrapRecoverableKg,
          discardScrapKg: data.scrapDiscardKg,
          scrapPercentage,
          cause: data.cause,
          operatorId,
        },
        include: { productionRequest: true, material: true, operator: { select: { id: true, name: true } } },
      });

      await transaction.productionRequest.update({
        where: { id: request.id },
        data: { status: 'COMPLETADA' },
      });

      if (data.scrapRecoverableKg > 0 && data.materialId) {
        await transaction.stockMovement.create({
          data: {
            type: 'MERMA',
            quantityKg: data.scrapRecoverableKg,
            materialId: data.materialId,
            userId: operatorId,
            productionRequestId: request.id,
            notes: `Merma recuperable de ${request.orderCode}`,
          },
        });
      }

      return record;
    });
  }

  findAllScrap() {
    return this.prisma.scrapRecord.findMany({
      include: { productionRequest: true, material: true, operator: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
