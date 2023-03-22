import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from './foods.controller';
import { FoodService } from './foods.service';

describe('FoodController', () => {
  let foodController: FoodController;
  let foodService: FoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [FoodService],
    }).compile();

    foodService = module.get<FoodService>(FoodService);
    foodController = module.get<FoodController>(FoodService);
  });

  it('should be defined', () => {
    expect(foodController).toBeDefined();
  });
});
