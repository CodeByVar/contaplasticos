import { Injectable, NotFoundException } from '@nestjs/common';
import { MaterialType, Prisma, ProcessType, StockStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

export interface RawMaterialFilters {
  search?: string;
  type?: MaterialType;
  minStockAlert?: boolean;
}

@Injectable()
export class RawMaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: RawMaterialFilters = {}) {
    const where: Prisma.RawMaterialWhereInput = {};

    if (filters.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.type) where.type = filters.type;

    const materials = await this.prisma.rawMaterial.findMany({
      where,
      include: { supplier: true },
      orderBy: { name: 'asc' },
    });

    return filters.minStockAlert
      ? materials.filter((material) => material.currentStockKg <= material.minStockKg)
      : materials;
  }

  async findOne(id: string) {
    const material = await this.prisma.rawMaterial.findUnique({
      where: { id },
      include: { supplier: true, entries: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });

    if (!material) throw new NotFoundException('Materia prima no encontrada');
    return material;
  }

  async create(data: CreateRawMaterialDto) {
    return this.prisma.rawMaterial.create({
      data: {
        ...data,
        type: data.type ?? MaterialType.RESINA,
        category: data.category ?? ProcessType.EXTRUSION,
        unit: data.unit ?? 'KG',
        minStockKg: data.minStockKg ?? 1000,
        maxCapacityKg: data.maxCapacityKg ?? 20000,
        status: this.calculateStatus(0, data.minStockKg ?? 1000),
      },
    });
  }

  async update(id: string, data: UpdateRawMaterialDto) {
    await this.findOne(id);
    const current = await this.prisma.rawMaterial.findUniqueOrThrow({ where: { id } });
    const minStockKg = data.minStockKg ?? current.minStockKg;
    const currentStockKg = current.currentStockKg;

    return this.prisma.rawMaterial.update({
      where: { id },
      data: {
        ...data,
        status: this.calculateStatus(currentStockKg, minStockKg),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.rawMaterial.delete({ where: { id } });
  }

  calculateStatus(currentStockKg: number, minStockKg: number): StockStatus {
    if (currentStockKg <= minStockKg * 0.5) return StockStatus.CRITICO;
    if (currentStockKg <= minStockKg) return StockStatus.BAJO;
    return StockStatus.OPTIMO;
  }
}
