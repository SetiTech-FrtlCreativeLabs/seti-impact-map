import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalInitiatives,
      totalPurchases,
      totalRevenue,
      recentPurchases,
      recentUpdates,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.initiative.count(),
      this.prisma.purchase.count(),
      this.prisma.purchase.aggregate({
        _sum: { total: true },
      }),
      this.prisma.purchase.findMany({
        take: 10,
        orderBy: { purchaseDate: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: { select: { title: true, sku: true } },
          initiative: { select: { title: true } },
        },
      }),
      this.prisma.initiativeUpdate.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true } },
          initiative: { select: { title: true } },
        },
      }),
    ]);

    return {
      totalUsers,
      totalInitiatives,
      totalPurchases,
      totalRevenue: totalRevenue._sum.total || 0,
      recentPurchases,
      recentUpdates,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        _count: {
          select: { purchases: true, notifications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPurchases() {
    return this.prisma.purchase.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: true,
        initiative: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  async getAllAIJobs() {
    return this.prisma.aIJob.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(userId: string, role: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
