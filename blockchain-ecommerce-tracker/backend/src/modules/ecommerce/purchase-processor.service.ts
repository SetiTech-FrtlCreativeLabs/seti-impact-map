import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { NotificationService } from '../notification/notification.service';
import { AIService } from '../ai/ai.service';

@Injectable()
export class PurchaseProcessorService {
  private readonly logger = new Logger(PurchaseProcessorService.name);

  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
    private notificationService: NotificationService,
    private aiService: AIService,
  ) {}

  async processOrder(orderData: any) {
    try {
      this.logger.log(`Processing order ${orderData.id}`);

      // 1. Create Purchase record
      const purchase = await this.createPurchaseRecord(orderData);

      // 2. Assign initiative (based on product metadata or admin mapping)
      const initiative = await this.assignInitiative(purchase);

      // 3. Mint blockchain token
      const blockchainResult = await this.blockchainService.mintToken({
        purchaseId: purchase.id,
        initiativeId: initiative.id,
        customerEmail: orderData.customer.email,
      });

      // 4. Update purchase with blockchain details
      await this.prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          blockchainTokenId: blockchainResult.tokenId,
          txHash: blockchainResult.txHash,
          status: 'BLOCKCHAIN_MINTED',
        },
      });

      // 5. Send notification to customer
      await this.notificationService.sendPurchaseConfirmation({
        email: orderData.customer.email,
        purchaseId: purchase.id,
        tokenId: blockchainResult.tokenId,
        txHash: blockchainResult.txHash,
      });

      // 6. Queue AI job for initiative update
      await this.aiService.queueJob({
        type: 'SUMMARIZE_UPDATE',
        input: {
          content: `New purchase linked to initiative: ${initiative.title}`,
          purchaseId: purchase.id,
        },
      });

      this.logger.log(`Successfully processed order ${orderData.id}`);
    } catch (error) {
      this.logger.error(`Failed to process order ${orderData.id}:`, error);
      throw error;
    }
  }

  private async createPurchaseRecord(orderData: any) {
    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email: orderData.customer.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: orderData.customer.email,
          name: `${orderData.customer.first_name} ${orderData.customer.last_name}`,
        },
      });
    }

    // Create purchase record for each line item
    const purchases = [];
    for (const lineItem of orderData.line_items) {
      const product = await this.prisma.product.findFirst({
        where: { sku: lineItem.sku },
      });

      if (product) {
        const purchase = await this.prisma.purchase.create({
          data: {
            userId: user.id,
            productId: product.id,
            quantity: lineItem.quantity,
            total: parseFloat(lineItem.price) * lineItem.quantity,
            orderId: orderData.id.toString(),
          },
        });
        purchases.push(purchase);
      }
    }

    return purchases[0]; // Return first purchase for simplicity
  }

  private async assignInitiative(purchase: any) {
    // Logic to assign initiative based on product metadata
    // This could be more sophisticated with admin mapping
    const initiatives = await this.prisma.initiative.findMany({
      where: { status: 'IN_PROGRESS' },
    });

    // Simple assignment logic - could be enhanced
    const randomInitiative = initiatives[Math.floor(Math.random() * initiatives.length)];
    
    await this.prisma.purchase.update({
      where: { id: purchase.id },
      data: { initiativeId: randomInitiative.id },
    });

    return randomInitiative;
  }
}
