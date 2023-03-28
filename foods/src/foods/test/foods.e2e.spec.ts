import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { default as migrate } from 'node-pg-migrate';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { pool } from '../../pool.pg';
import { foodListMockAPI } from './food-mock.const';

const testOptionsDb = {
  user: process.env.POSTGRES_USER_TEST,
  host: process.env.POSTGRES_HOST_TEST,
  database: process.env.POSTGRES_DB_NAME_TEST,
  password: process.env.POSTGRES_PASSWORD_TEST,
  port: parseInt(process.env.POSTGRES_PORT),
};

describe('FoodController (e2e)', () => {
  const cookie = [
    'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkwTVdRMk5ESTFOVEk0WW1FeE16YzJNRFkyTmpJeVppSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRZM09UWTBOemM0TVgwLk9HWU9xVjFTMHI0OF9YUHBBZ0xLQ0FEN202bzU0cHcxRVdERGRScjYtd2sifQ==; path=/; httponly',
  ];
  let app: INestApplication;
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
    await pool.query(`SELECT 1+1`);

    console.log('Postgres testing connected');
    await app.init();
  });

  it('db connection test', () => expect(1 + 1).toBe(2));

  // no cookie sent
  it('POST /foods -> create food', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/foods')
      .send({ ...foodListMockAPI[0], item_section: 1, item_extra: 1 })
      .expect(201);
    expect(response.body.results).toEqual({
      ...foodListMockAPI[0],
      item_section: 1,
      item_extra: 1,
      id: 1,
    });
  });

  it('/foods/all (GET) - should not be able to access if not authenticated', async () => {
    return request(app.getHttpServer())
      .get('/api/foods/all')
      .send()
      .expect(401);
  });

  it('/foods/all (GET) - should be able to access if authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/foods/all')
      .set('Cookie', cookie)
      .send()
      .expect(200);
    expect(response.body.results.length).toEqual(1);
  });

  it('POST /foods -> create several foods', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/foods')
      .send([foodListMockAPI[1], foodListMockAPI[2]])
      .expect(201);
    expect(response.body.results).toEqual([
      { ...foodListMockAPI[1], id: 2 },
      { ...foodListMockAPI[2], id: 3 },
    ]);
  });

  it('/foods/all (GET) - should be able to access if authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/foods/all')
      .set('Cookie', cookie)
      .send()
      .expect(200);
    expect(response.body.results.length).toEqual(3);
  });

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
