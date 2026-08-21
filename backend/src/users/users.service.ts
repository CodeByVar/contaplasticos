import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

export type UserRole = 'ADMIN' | 'ALMACEN' | 'PRODUCCION' | 'SUPERVISOR';

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  shift?: string | null;
  status?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        shift: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role as UserRole,
      shift: user.shift,
      status: 'ACTIVE',
    };
  }

  async findOne(id: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role as UserRole,
      shift: user.shift,
      status: 'ACTIVE',
    };
  }

  async create(data: { email: string; password: string; name: string; role?: UserRole; shift?: string | null }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: passwordHash,
        name: data.name,
        role: data.role ?? 'PRODUCCION',
        shift: data.shift ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        shift: true,
        createdAt: true,
      },
    });
  }
}
