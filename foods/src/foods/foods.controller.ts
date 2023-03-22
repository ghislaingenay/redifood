import { Controller } from '@nestjs/common';
import { FoodService } from './foods.service';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
}
