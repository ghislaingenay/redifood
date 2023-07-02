import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  EOrderStatus,
  EPaymentType,
  IFoodOrder,
} from '../../redifood-module/src/interfaces';

export class CreateOrderDto {
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  orderTableNumber: number;

  orderItems: IFoodOrder[];
  // orderCurrency: ECurrency; // block the currency from the frontend
}

export class UpdateOrderDto {
  orderItems: IFoodOrder[];
}

export class AwaitPaymentDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(EPaymentType)
  paymentType: EPaymentType;
}

export class ReceiptBodyDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  orderNo: string;

  @IsEnum(EOrderStatus)
  orderStatus: EOrderStatus;

  @IsNotEmpty()
  @IsDateString()
  orderCreatedDate: Date;

  @IsNotEmpty()
  @IsDateString()
  orderFinished: Date;

  @IsPositive()
  @IsInt()
  orderTableNumber: number;

  @IsPositive()
  @IsInt()
  orderTotal: number;

  @IsString()
  orderItems: string;
}

export class CreateOrderItemsDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;
}
