import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || 'usd',
        customer: data.customerId,
        metadata: data.metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.log(`Payment intent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  async createCustomer(data: {
    email: string;
    name?: string;
    phone?: string;
  }) {
    try {
      const customer = await this.stripe.customers.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
      });

      this.logger.log(`Customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error('Failed to create customer:', error);
      throw error;
    }
  }

  async createCheckoutSession(data: {
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
    customerId?: string;
    metadata?: Record<string, string>;
  }) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: data.lineItems,
        mode: 'payment',
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        customer: data.customerId,
        metadata: data.metadata,
      });

      this.logger.log(`Checkout session created: ${session.id}`);
      return session;
    } catch (error) {
      this.logger.error('Failed to create checkout session:', error);
      throw error;
    }
  }

  async handleWebhook(payload: string, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET'),
      );

      this.logger.log(`Webhook received: ${event.type}`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error('Webhook handling failed:', error);
      throw error;
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    this.logger.log(`Payment succeeded: ${paymentIntent.id}`);
    
    // Create purchase record
    const purchase = await this.prisma.purchase.create({
      data: {
        userId: paymentIntent.metadata.userId,
        productId: paymentIntent.metadata.productId,
        quantity: parseInt(paymentIntent.metadata.quantity),
        total: paymentIntent.amount / 100,
        orderId: paymentIntent.id,
        status: 'CONFIRMED',
        metadata: {
          stripePaymentIntentId: paymentIntent.id,
          stripeCustomerId: paymentIntent.customer,
        },
      },
    });

    // Trigger blockchain minting and other processes
    // This would integrate with your existing purchase processor
    return purchase;
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    this.logger.log(`Checkout completed: ${session.id}`);
    
    // Handle completed checkout session
    // This could trigger the same purchase processing as above
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    this.logger.log(`Payment failed: ${paymentIntent.id}`);
    
    // Handle failed payment
    // Could send notification to user, update order status, etc.
  }

  async getPaymentIntent(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error('Failed to retrieve payment intent:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      this.logger.log(`Refund created: ${refund.id}`);
      return refund;
    } catch (error) {
      this.logger.error('Failed to create refund:', error);
      throw error;
    }
  }
}
