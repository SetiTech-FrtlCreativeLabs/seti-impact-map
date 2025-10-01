import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialize SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendPurchaseConfirmation(data: {
    email: string;
    purchaseId: string;
    tokenId: string;
    txHash: string;
  }) {
    try {
      // Create notification record
      await this.prisma.notification.create({
        data: {
          userId: (await this.prisma.user.findUnique({ where: { email: data.email } })).id,
          type: 'PURCHASE_CONFIRMED',
          payload: {
            purchaseId: data.purchaseId,
            tokenId: data.tokenId,
            txHash: data.txHash,
          },
        },
      });

      // Send email
      if (process.env.SENDGRID_API_KEY) {
        await sgMail.send({
          to: data.email,
          from: process.env.FROM_EMAIL,
          subject: 'Purchase Confirmed - Your Blockchain Token',
          html: `
            <h2>Purchase Confirmed!</h2>
            <p>Your purchase has been confirmed and a blockchain token has been minted.</p>
            <p><strong>Token ID:</strong> ${data.tokenId}</p>
            <p><strong>Transaction Hash:</strong> ${data.txHash}</p>
            <p>You can view your token and track the initiative progress in your dashboard.</p>
          `,
        });
      }

      this.logger.log(`Purchase confirmation sent to ${data.email}`);
    } catch (error) {
      this.logger.error('Failed to send purchase confirmation:', error);
      throw error;
    }
  }

  async sendInitiativeUpdate(data: {
    userId: string;
    initiativeId: string;
    updateId: string;
  }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
      });

      const initiative = await this.prisma.initiative.findUnique({
        where: { id: data.initiativeId },
      });

      // Create notification
      await this.prisma.notification.create({
        data: {
          userId: data.userId,
          type: 'INITIATIVE_UPDATE',
          payload: {
            initiativeId: data.initiativeId,
            initiativeTitle: initiative.title,
            updateId: data.updateId,
          },
        },
      });

      // Send email if user has email
      if (user.email && process.env.SENDGRID_API_KEY) {
        await sgMail.send({
          to: user.email,
          from: process.env.FROM_EMAIL,
          subject: `Update: ${initiative.title}`,
          html: `
            <h2>Initiative Update</h2>
            <p>There's a new update for the initiative you're following: <strong>${initiative.title}</strong></p>
            <p>Check your dashboard to see the full update and track progress.</p>
          `,
        });
      }

      this.logger.log(`Initiative update notification sent to user ${data.userId}`);
    } catch (error) {
      this.logger.error('Failed to send initiative update notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, limit: number = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markNotificationAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
