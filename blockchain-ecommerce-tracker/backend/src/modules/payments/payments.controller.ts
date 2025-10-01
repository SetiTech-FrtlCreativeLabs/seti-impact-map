import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(@Body() data: {
    amount: number;
    currency?: string;
    productId: string;
    quantity: number;
  }) {
    return this.paymentsService.createPaymentIntent({
      amount: data.amount,
      currency: data.currency || 'usd',
      metadata: {
        productId: data.productId,
        quantity: data.quantity.toString(),
      },
    });
  }

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(@Body() data: {
    lineItems: Array<{
      price_data: {
        currency: string;
        product_data: {
          name: string;
          description?: string;
        };
        unit_amount: number;
      };
      quantity: number;
    }>;
    successUrl: string;
    cancelUrl: string;
  }) {
    return this.paymentsService.createCheckoutSession(data);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(JSON.stringify(payload), signature);
  }

  @Get('payment-intent/:id')
  @UseGuards(JwtAuthGuard)
  async getPaymentIntent(@Param('id') id: string) {
    return this.paymentsService.getPaymentIntent(id);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  async refundPayment(@Body() data: {
    paymentIntentId: string;
    amount?: number;
  }) {
    return this.paymentsService.refundPayment(data.paymentIntentId, data.amount);
  }
}
