import { NotAcceptableException } from '@nestjs/common';
import Stripe from 'stripe';

class StripeCharge {
  chargeId?: string;
  private stripeClient: Stripe;
  constructor(chargeId?: string) {
    this.chargeId = chargeId;
  }

  // Initialize client
  private initializeClient() {
    if (!process.env.STRIPE_API_KEY) {
      throw new NotAcceptableException('A Stripe API key must be provided');
    }
    this.stripeClient = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  private checkChargeId() {
    if (!this.chargeId) {
      throw new NotAcceptableException('A charge ID must be provided');
    }
  }

  protected async retrieveCharge(): Promise<Stripe.Charge> {
    this.initializeClient();
    this.checkChargeId();
    return await this.stripeClient.charges.retrieve(this.chargeId);
  }

  protected async updateCharge(data: any) {
    this.initializeClient();
    this.checkChargeId();
    // send data in snake case
    return await this.stripeClient.charges.update(this.chargeId, {
      metadata: data,
    });
  }
}

export default StripeCharge;
