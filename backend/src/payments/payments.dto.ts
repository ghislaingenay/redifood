import { IsEnum, IsInt, IsString } from 'class-validator';
import {
  EPaymentType,
  UserPayload,
} from '../../redifood-module/src/interfaces';

export class CreatePaymentDto {
  @IsInt()
  orderId: number;

  @IsEnum(EPaymentType)
  paymentType: EPaymentType;

  @IsString()
  userId: UserPayload['id'];

  @IsInt()
  discountId: number; // 0 if no discount

  @IsInt()
  orderTotal: number;
}
