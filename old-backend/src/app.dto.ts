import { IsString, IsNotEmpty } from 'class-validator';
import { Menu } from './app.interface';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OrderDto {
  table: number;
  paid: boolean;
  total: number;
  menu: Menu[];
  date?: Date;
  payment: string;
}

export class FoodDto {
  _id?: string;
  name: string;
  photo: string;
  description: string;
  price: number;
  section: string;
  extra: string;
}
