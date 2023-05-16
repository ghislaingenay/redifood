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
  private service: TService;
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
    this.service = service;
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
    switch (this.service) {
      case 'orders':
        return await Orders.findOne({
          userId: this.userId,
          orderId: this.id,
        }); // later => create similar function for payments in repo
      case 'payments':
        return '';
      default:
        return '';
    }
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

  private async payCharge(): Promise<Stripe.Charge> {
    this.initializeClient();
    const { lang, currency } = await this.getUserInformation();
    const currValue = currency === 'USD' ? 'usd' : 'eur';
    const data = await this.getTargetedDataInService();
    const chargeResponse = await this.client.charges.create({
      amount: 2000,
      currency: currValue,
      source: 'tok_amex',
      description: ``,
    });
    return chargeResponse;
    // What to do ?
  }
}

//   const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

export default StripePayService;

// Response from charge
// {
//   "id": "ch_17LYzm2eZvKYlo2CUAhwAYTk",
//   "object": "charge",
//   "amount": 2000,
//   "amount_captured": 1000,
//   "amount_refunded": 0,
//   "application": null,
//   "application_fee": null,
//   "application_fee_amount": null,
//   "balance_transaction": "txn_1032Rp2eZvKYlo2CpErRBj09",
//   "billing_details": {
//     "address": {
//       "city": null,
//       "country": null,
//       "line1": null,
//       "line2": null,
//       "postal_code": null,
//       "state": null
//     },
//     "email": null,
//     "name": null,
//     "phone": null
//   },
//   "calculated_statement_descriptor": null,
//   "captured": true,
//   "created": 1450963146,
//   "currency": "usd",
//   "customer": null,
//   "description": "My First Test Charge (created for API docs at https://www.stripe.com/docs/api)",
//   "disputed": false,
//   "failure_balance_transaction": null,
//   "failure_code": null,
//   "failure_message": null,
//   "fraud_details": {},
//   "invoice": null,
//   "livemode": false,
//   "metadata": {},
//   "on_behalf_of": null,
//   "outcome": {
//     "network_status": null,
//     "reason": null,
//     "risk_level": "not_assessed",
//     "seller_message": "Payment complete.",
//     "type": "authorized"
//   },
//   "paid": true,
//   "payment_intent": null,
//   "payment_method": "card_17LYzl2eZvKYlo2CP68sNNpd",
//   "payment_method_details": {
//     "card": {
//       "brand": "mastercard",
//       "checks": {
//         "address_line1_check": null,
//         "address_postal_code_check": null,
//         "cvc_check": "pass"
//       },
//       "country": "US",
//       "exp_month": 11,
//       "exp_year": 2016,
//       "fingerprint": "7a9bk9ncM08SXfua",
//       "funding": "credit",
//       "installments": null,
//       "last4": "4444",
//       "mandate": null,
//       "moto": null,
//       "network": "mastercard",
//       "network_token": {
//         "used": false
//       },
//       "three_d_secure": null,
//       "wallet": null
//     },
//     "type": "card"
//   },
//   "receipt_email": "schlossronit@gmail.com",
//   "receipt_number": "1179-5581",
//   "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xMDMyRDgyZVp2S1lsbzJDKJuKiaMGMgZ2-8QEb186LBbyaw_Q530owFfCtmvxjdqLX_OcwjJoLjhpdiRH7PZcHUcnDBlhc5J4tXnM",
//   "redaction": null,
//   "refunded": false,
//   "refunds": {
//     "object": "list",
//     "data": [],
//     "has_more": false,
//     "url": "/v1/charges/ch_17LYzm2eZvKYlo2CUAhwAYTk/refunds"
//   },
//   "review": null,
//   "shipping": null,
//   "source_transfer": null,
//   "statement_descriptor": null,
//   "statement_descriptor_suffix": null,
//   "status": "succeeded",
//   "transfer_data": null,
//   "transfer_group": null,
//   "source": "tok_mastercard"
