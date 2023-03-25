import { Controller, Get } from '@nestjs/common';
import {
  IFoodGetApi,
  IGetServerSideData,
} from 'redifood-module/src/interfaces';
import { FoodService } from './foods.service';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('all')
  async getAllFoods() {
    return await this.foodService.getAllFoods();
  }
}
