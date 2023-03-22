import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from '../../foods/foods.controller';
import { FoodService } from '../../foods/foods.service';

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
    expect(foodService).toBeDefined();
  });
});

describe('createQuery function test from data in DB format', () => {
  it.todo('should loop in one food and display the proper query');
  it.todo('should loop in several foods and display the proper query');
});

describe('convertKeys test function', () => {
  it.todo('should convert api to db if all keys are inside');
  it.todo('should convert db to api if all keys are inside');
  it.todo(
    'should remove undefined or missing keys during conversion from db to api',
  );
  it.todo(
    'should remove undefined or missing keys during conversion from api to db',
  );
});

describe('createQuery function test from data in Api format', () => {
  it.todo('should loop in one food and display the proper query');
  it.todo('should loop in several foods and display the proper query');
  it.todo('should convert null price and display the proper querys');
});

it.todo('createQuery with APi keys');
