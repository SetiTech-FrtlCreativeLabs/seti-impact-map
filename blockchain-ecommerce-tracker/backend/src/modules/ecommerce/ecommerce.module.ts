import { Module } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { ShopifyWebhookController } from './shopify-webhook.controller';
import { PurchaseProcessorService } from './purchase-processor.service';

@Module({
  providers: [EcommerceService, PurchaseProcessorService],
  controllers: [ShopifyWebhookController],
  exports: [EcommerceService],
})
export class EcommerceModule {}
