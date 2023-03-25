import { Controller, Get, Param } from '@nestjs/common';
import { FoodService } from './foods.service';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('all')
  async getAllFoods() {
    return await this.foodService.getAllFoods();
  }

  @Get('section/:id')
  async getFoodBySectionId(@Param('id') id: number) {
    return await this.foodService.getFoodBySectionId(id);
  }
}
