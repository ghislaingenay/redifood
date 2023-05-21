import { IsBoolean, IsEnum, IsInt, IsNumber } from 'class-validator';
import {
  EPaymentStatus,
  EPaymentType,
} from '../../redifood-module/src/interfaces';

export class CreatePaymentDto {
  @IsInt()
  orderId: number;

  @IsEnum(EPaymentType)
  paymentType: EPaymentType;

  @IsInt()
  paymentDiscountId: number; // 0 if no discount

  @IsInt()
  paymentAmount: number;

  @IsBoolean()
  paymentDiscountApplied: boolean;

  @IsNumber()
  paymentTaxAmount: number;

  @IsEnum(EPaymentStatus)
  paymentStatus: EPaymentStatus;
}
