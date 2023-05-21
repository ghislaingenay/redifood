import { NotAcceptableException } from '@nestjs/common';
import { Setting } from 'src/models/settings.model';
import Orders from 'src/orders/ordersrepo';
import Stripe from 'stripe';
import {
  ECurrency,
  ELanguage,
  UserPayload,
} from '../../redifood-module/src/interfaces';

type TService = 'orders' | 'payments';

class StripePayService {
  private client: Stripe;
  protected userId: UserPayload['id'];
  private token: Stripe.Token;
  // private service: TService;
  private id: number;

  // Constructor
  constructor({
    userId,
    token,
    service,
    id,
  }: {
    userId: UserPayload['id'];
    token: Stripe.Token;
    service: TService;
    id: number;
  }) {
    this.userId = userId;
    this.token = token;
    // this.service = service;
    this.id = id;
  }

  // Initialize client
  private initializeClient() {
    if (!process.env.STRIPE_API_KEY) {
      throw new NotAcceptableException('A Stripe API key must be provided');
    }
    this.client = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  private async getTargetedDataInService() {
    // function that check the services and send back the targeted data
    // switch (this.service) {
    //   case 'orders':
    return await Orders.findOne({
      userId: this.userId,
      orderId: this.id,
    }); // later => create similar function for payments in repo
    //   case 'payments':
    //     return '';
    //   default:
    //     return '';
    // }
  }

  private async getUserInformation(): Promise<{
    lang: ELanguage;
    currency: ECurrency;
  }> {
    const settingsData = await Setting.findOne({ user: this.userId });
    return {
      lang: settingsData.language,
      currency: settingsData.currency,
    };
  }

  public async payCharge(): Promise<Stripe.Charge> {
    this.initializeClient();
    const { lang, currency } = await this.getUserInformation();
    const orderDescription =
      lang === ELanguage.ENGLISH ? 'Order number' : 'Commande numéro';
    const currValue = currency === 'USD' ? 'usd' : 'eur';
    const data = await this.getTargetedDataInService();
    const chargeResponse = await this.client.charges.create({
      amount: 2000,
      currency: currValue,
      source: this.token as unknown as string,
      description: `${orderDescription} ${data.orderNo}`,
    });
    return chargeResponse;
  }
}

export default StripePayService;
