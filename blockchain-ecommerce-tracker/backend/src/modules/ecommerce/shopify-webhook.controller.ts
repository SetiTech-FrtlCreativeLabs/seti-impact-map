import { Controller, Post, Headers, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PurchaseProcessorService } from './purchase-processor.service';
import * as crypto from 'crypto';

@Controller('webhooks/shopify')
export class ShopifyWebhookController {
  constructor(private purchaseProcessor: PurchaseProcessorService) {}

  @Post('orders/paid')
  @HttpCode(HttpStatus.OK)
  async handleOrderPaid(
    @Headers('x-shopify-hmac-sha256') hmac: string,
    @Body() orderData: any,
  ) {
    // Verify webhook authenticity
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    const calculatedHmac = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(orderData))
      .digest('base64');

    if (hmac !== calculatedHmac) {
      throw new Error('Invalid webhook signature');
    }

    // Process the order
    await this.purchaseProcessor.processOrder(orderData);
    
    return { success: true };
  }

  @Post('orders/updated')
  @HttpCode(HttpStatus.OK)
  async handleOrderUpdated(
    @Headers('x-shopify-hmac-sha256') hmac: string,
    @Body() orderData: any,
  ) {
    // Similar verification and processing
    return { success: true };
  }
}
