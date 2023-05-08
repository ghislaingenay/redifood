import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { EOrderStatus, IFoodOrder } from '../../redifood-module/src/interfaces';

export class CreateOrderDto {
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  orderTableNumber: number;

  orderItems: IFoodOrder[];
  // orderCurrency: ECurrency; // block the currency from the frontend
}

// export class UpdateOrderDto extends CreateOrderDto {
//   @IsInt()
//   @IsNotEmpty()
//   id: number;

//   @IsPositive()
//   @IsInt()
//   @IsNotEmpty()
//   orderTotal: number;

//   @IsEnum(EOrderStatus)
//   orderStatus: EOrderStatus;
// }
