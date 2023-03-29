import {
  buildInsertIntoKeyValuePair,
  convertKeys,
  createQuery,
  updateQuery,
} from '../../global.function';
import {
  foodListMockAPI,
  foodListMockDB,
  goodFoodMockApi,
  goodFoodMockDb,
  wrongFoodMockApi1,
  wrongFoodMockApi2,
  wrongFoodMockDB,
} from './food-mock.const';

// describe('FoodController', () => {
//   let foodController: FoodController;
//   let foodService: FoodService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [FoodController],
//       providers: [FoodService],
//     }).compile();

//     foodService = module.get<FoodService>(FoodService);
//     foodController = module.get<FoodController>(FoodService);
//   });
// });

describe('createQuery function test from data in DB format', () => {
  it('should loop in one food and display the proper query', () => {
    const food = foodListMockDB[0];
    expect(createQuery(food, 'foods')).toStrictEqual(
      `INSERT INTO foods (item_name,item_photo,item_price,item_description,section_id,extra_id,item_quantity) VALUES ('Pizza Mediterranean','ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',12.5,'Soo good',2,4,0)`,
    );
  });
  it('should loop in several foods and display the proper query', () => {
    const foods = [foodListMockDB[0], foodListMockDB[1], foodListMockDB[2]];
    expect(createQuery(foods, 'foods')).toStrictEqual(
      `INSERT INTO foods (item_name,item_photo,item_price,item_description,section_id,extra_id,item_quantity) VALUES ('Pizza Mediterranean','ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',12.5,'Soo good',2,4,0), ('Pizza Cheesy','photo-1520201163981-8cc95007dd2a?',13.99,'Gorgonzola, gouda, mozzarella, blue cheese',2,3,0), ('Millefeuille','images.unsplash.com/photo-1587122569949-ae6e755c6bdc?',4.25,'The traditional French Millefeuille',1,2,0)`,
    );
  });
});

describe('convertKeys test function', () => {
  it('should convert api to db if all keys are inside', () => {
    expect(convertKeys(foodListMockDB[0], 'dbToApi')).toStrictEqual(
      foodListMockAPI[0],
    );
    expect(convertKeys(foodListMockDB[1], 'dbToApi')).toStrictEqual(
      foodListMockAPI[1],
    );
    expect(convertKeys(foodListMockDB[2], 'dbToApi')).toStrictEqual(
      foodListMockAPI[2],
    );
  });
  it('should convert db to api if all keys are inside', () => {
    expect(convertKeys(foodListMockAPI[0], 'apiToDb')).toStrictEqual(
      foodListMockDB[0],
    );
    expect(convertKeys(foodListMockAPI[1], 'apiToDb')).toStrictEqual(
      foodListMockDB[1],
    );
    expect(convertKeys(foodListMockAPI[2], 'apiToDb')).toStrictEqual(
      foodListMockDB[2],
    );
  });
  it('should throw an error if not convert api to db if all keys are inside', () => {
    expect(() => convertKeys(wrongFoodMockDB, 'dbToApi')).toThrow(
      new Error('itemDescription should be snake case and not be null'),
    );
  });
  it('should throw an error if not convert db to api if all keys are inside', () => {
    expect(() => convertKeys(wrongFoodMockApi1, 'apiToDb')).toThrow(
      new Error('hello should be camel case and not be null'),
    );
  });
  it('should throw an error if not convert db to api if all keys are inside', () => {
    expect(() => convertKeys(wrongFoodMockApi2, 'apiToDb')).toThrow(
      new Error('item_extra should be camel case and not be null'),
    );
  });
  it('should not throw an error if convert db to api if on ekey is id', () => {
    expect(convertKeys(goodFoodMockDb, 'dbToApi')).toStrictEqual(
      goodFoodMockApi,
    );
  });
  it('should not throw an error if convert api to db if on ekey is id', () => {
    expect(convertKeys(goodFoodMockApi, 'apiToDb')).toStrictEqual(
      goodFoodMockDb,
    );
  });
});

describe('Create keys-pairs function test', () => {
  it('should create keys-pairs from one food', () => {
    const data = {
      item_price: 7,
      item_name: 'Pizza',
      item_quantity: null,
      id: undefined,
    };
    expect(buildInsertIntoKeyValuePair(data)).toStrictEqual({
      keys: 'item_price,item_name,item_quantity,id',
      values: "7,'Pizza',NULL,NULL",
    });
  });

  it('should throw an error if no data is sent', () => {
    expect(() => buildInsertIntoKeyValuePair({})).toThrow(
      new Error('data should be defined'),
    );
  });
});

describe('createQuery function test from data in Api format', () => {
  it('should loop in one food (api) and display the proper query', () => {
    const foodDB = convertKeys(foodListMockAPI[0], 'apiToDb');
    expect(createQuery(foodDB, 'foods')).toStrictEqual(
      `INSERT INTO foods (item_name,item_photo,item_price,item_description,section_id,extra_id,item_quantity) VALUES ('Pizza Mediterranean','ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',12.5,'Soo good',2,4,0)`,
    );
  });
  it('should loop in several foods (api) and display the proper query', () => {
    const foodList = [
      foodListMockAPI[0],
      foodListMockAPI[1],
      foodListMockAPI[2],
    ];
    const foodListDB = foodList.map((food) => convertKeys(food, 'apiToDb'));
    expect(createQuery(foodListDB, 'foods')).toStrictEqual(
      `INSERT INTO foods (item_name,item_photo,item_price,item_description,section_id,extra_id,item_quantity) VALUES ('Pizza Mediterranean','ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',12.5,'Soo good',2,4,0), ('Pizza Cheesy','photo-1520201163981-8cc95007dd2a?',13.99,'Gorgonzola, gouda, mozzarella, blue cheese',2,3,0), ('Millefeuille','images.unsplash.com/photo-1587122569949-ae6e755c6bdc?',4.25,'The traditional French Millefeuille',1,2,0)`,
    );
  });

  it('should loop in one food (db) and display the proper query', () => {
    expect(() =>
      createQuery(convertKeys(foodListMockDB[0], 'apiToDb'), 'foods'),
    ).toThrow(new Error('item_name should be camel case and not be null'));
  });

  describe('update query function test', () => {
    it('should loop in one food (db) and display the proper query', () => {
      expect(updateQuery(foodListMockDB[0], 'foods')).toStrictEqual(
        `UPDATE foods SET item_name = 'Pizza Mediterranean', item_photo = 'ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', item_price = 12.5, item_description = 'Soo good', section_id = 2, extra_id = 4, item_quantity = 0`,
      );
    });
    it('should loop in several foods (db) and display the proper query', () => {
      expect(updateQuery(foodListMockDB[1], 'foods')).toStrictEqual(
        `UPDATE foods SET item_name = 'Pizza Cheesy', item_photo = 'photo-1520201163981-8cc95007dd2a?', item_price = 13.99, item_description = 'Gorgonzola, gouda, mozzarella, blue cheese', section_id = 2, extra_id = 3, item_quantity = 0`,
      );
    });
  });
});
