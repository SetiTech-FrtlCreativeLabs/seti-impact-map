import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class EcommerceService {
  private readonly logger = new Logger(EcommerceService.name);

  constructor(private prisma: PrismaService) {}

  async getProducts() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async createProduct(data: {
    sku: string;
    title: string;
    description?: string;
    price: number;
    metadata?: any;
  }) {
    return this.prisma.product.create({
      data,
    });
  }

  async updateProduct(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
