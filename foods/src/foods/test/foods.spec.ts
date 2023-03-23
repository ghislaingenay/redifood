import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from '../../foods/foods.controller';
import { FoodService } from '../../foods/foods.service';
import { createQuery } from '../../global.function';
import { foodListMockDB } from './food-mock.const';

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
  it('should loop in one food and display the proper query', () => {
    const food = foodListMockDB[0];
    expect(createQuery(food, 'foods')).toStrictEqual(
      `INSERT INTO foods (item_name,item_photo,item_price,item_description,item_section,item_extra,item_quantity) VALUES ('Pizza Mediterranean','ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',12.5,'Soo good',2,4,0)`,
    );
  });
  // it('should loop in several foods and display the proper query', () => {
  //   const foods = [foodListMockDB[0], foodListMockDB[1], foodListMockDB[2]];
  //   expect(createQuery(foods, 'foods')).toStrictEqual(
  //     `INSERT INTO foods (item_name,item_photo,item_price,item_description,item_section,item_extra,item_quantity) VALUES ('Pizza Mediterranean','ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',12.5,'Soo good',2,4,0), ('Pizza Cheesy','photo-1520201163981-8cc95007dd2a?',13.99,'Gorgonzola, gouda, mozzarella, blue cheese', 2, 3, 0), ('Millefeuille', 'images.unsplash.com/photo-1587122569949-ae6e755c6bdc?', 4.25, 'The traditional French Millefeuille', 1, 2, 0)`,
  //   );
  // });
});

// describe('convertKeys test function', () => {
//   it('should convert api to db if all keys are inside', () => {
//     expect(convertKeys(foodListMockDB[0], 'dbToApi')).toStrictEqual(
//       foodListMockAPI[0],
//     );
//     expect(convertKeys(foodListMockDB[1], 'dbToApi')).toStrictEqual(
//       foodListMockAPI[1],
//     );
//     expect(convertKeys(foodListMockDB[2], 'dbToApi')).toStrictEqual(
//       foodListMockAPI[2],
//     );
//   });
//   it('should convert db to api if all keys are inside', () => {
//     expect(convertKeys(foodListMockAPI[0], 'apiToDb')).toStrictEqual(
//       foodListMockDB[0],
//     );
//     expect(convertKeys(foodListMockAPI[1], 'apiToDb')).toStrictEqual(
//       foodListMockDB[1],
//     );
//     expect(convertKeys(foodListMockAPI[2], 'apiToDb')).toStrictEqual(
//       foodListMockDB[2],
//     );
//   });
//   it('should throw an error if not convert api to db if all keys are inside', () => {
//     expect(convertKeys(wrongFoodMockDB, 'dbToApi')).toThrowError(
//       'itemDescription should be snake case and not be null',
//     );
//   });
//   it('should throw an error if not convert db to api if all keys are inside', () => {
//     expect(convertKeys(wrongFoodMockApi1, 'apiToDb')).toThrowError(
//       'hello should be camel case and not be null',
//     );
//   });
//   it('should throw an error if not convert db to api if all keys are inside', () => {
//     expect(convertKeys(wrongFoodMockApi2, 'apiToDb')).toThrowError(
//       'item_extra should be camel case and not be null',
//     );
//   });
//   it('should not throw an error if convert db to api if on ekey is id', () => {
//     expect(convertKeys(goodFoodMockDb, 'dbToApi')).toStrictEqual(
//       goodFoodMockApi,
//     );
//   });
//   it('should not throw an error if convert api to db if on ekey is id', () => {
//     expect(convertKeys(goodFoodMockApi, 'apiToDb')).toStrictEqual(
//       goodFoodMockDb,
//     );
//   });
// });

// describe('createQuery function test from data in Api format', () => {
//   it.todo('should loop in one food and display the proper query');
//   it.todo('should loop in several foods and display the proper query');
//   it.todo('should convert null price and display the proper querys');
// });

it.todo('createQuery with APi keys');
