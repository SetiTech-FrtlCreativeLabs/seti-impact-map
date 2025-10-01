import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        purchases: {
          include: {
            product: true,
            initiative: true,
          },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getUserPurchases(userId: string) {
    return this.prisma.purchase.findMany({
      where: { userId },
      include: {
        product: true,
        initiative: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }
}
