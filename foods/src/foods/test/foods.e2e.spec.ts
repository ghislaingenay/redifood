import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { default as migrate } from 'node-pg-migrate';
import { AppModule } from '../../app.module';
import { pool } from '../../pool.pg';
import { FoodService } from '../foods.service';
// import { foodListDB } from './food-mock.const';

const testOptionsDb = {
  user: process.env.POSTGRES_USER_TEST,
  host: process.env.POSTGRES_HOST_TEST,
  database: process.env.POSTGRES_DB_NAME_TEST,
  password: process.env.POSTGRES_PASSWORD_TEST,
  port: parseInt(process.env.POSTGRES_PORT),
};
describe('FoodController (integration)', () => {
  let app: INestApplication;
  // const foodService = { getFoods: () => foodListDB };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FoodService)
      .useValue(FoodService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/foods (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/foods')
  //     .query({ selectedOption: 'all' })
  //     .expect(200)
  //     .expect({
  //       results: foodService.getFoods(),
  //     });
  // });
  it('db connection test', () => expect(1 + 1).toBe(2));

  afterAll(async () => {
    await app.close();
  });
});

describe('FoodController (e2e)', () => {
  beforeAll(async () => {
    const app: INestApplication =
      await NestFactory.create<NestExpressApplication>(AppModule);

    // Run our migrations in new schema
    await migrate({
      schema: 'public',
      direction: 'up',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      log: () => {},
      noLock: true,
      dir: 'migrations',
      databaseUrl: testOptionsDb,
      migrationsTable: 'pgmigrations',
    });
    console.log('Migrations ran');
    // Connect to PG as
    await pool.connect(testOptionsDb);
    await pool.query(
      `INSERT INTO food_section (section_order, section_name, section_description) VALUES (1,'hello', 'miii');`,
    );

    console.log('Postgres testing connected');
    await app.init();
  });

  it('db connection test', () => expect(1 + 1).toBe(2));
  afterAll(async () => {
    await migrate({
      schema: 'public',
      direction: 'down',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      log: () => {},
      noLock: true,
      dir: 'migrations',
      databaseUrl: testOptionsDb,
      migrationsTable: 'pgmigrations',
    });
    console.log('Migrations down ran');
  });
});
