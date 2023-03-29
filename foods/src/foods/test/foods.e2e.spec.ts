import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { default as migrate } from 'node-pg-migrate';
import request from 'supertest';
import Foods from '../../../src/foods.postgres';
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

const cookie = [
  'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkwTVdRMk5ESTFOVEk0WW1FeE16YzJNRFkyTmpJeVppSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRZM09UWTBOemM0TVgwLk9HWU9xVjFTMHI0OF9YUHBBZ0xLQ0FEN202bzU0cHcxRVdERGRScjYtd2sifQ==; path=/; httponly',
];
describe('FoodController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
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

  it.skip('DB is properly connected', () => expect(1 + 1).toBe(2));

  // no cookie sent

  // it('/foods/all (GET) - should not be able to access if not authenticated', async () => {
  //   return request(app).get('/api/foods/all').send().expect(401);
  // });

  // it.skip('POST /foods -> create food', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/api/foods')
  //     .send({ ...foodListMockAPI[0], item_section: 1, item_extra: 1 })
  //     .expect(401);
  // });

  describe('SECTION', () => {
    it.skip('POST create a section - show error if not authenticated', async () => {
      console.log('app', request(app), request.agent(app));
      await request(app)
        .post('/api/foods/section')
        .send({ sectionName: 'pizza', sectionDescription: 'Pizza' })
        .expect(401);
    });

    it.skip('POST create a section fails if user don/t send data', async () => {
      await request(app)
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send()
        .expect(400);
    });

    it.skip('POST create a section fails if user don/t send sectionName', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionDescription: 'Pizza' })
        .expect(400);
    });

    it.skip('POST create a section fails if user don/t send section_name instead of sectionName', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ section_name: 'pizza', sectionDescription: 'Pizza' })
        .expect(400);
    });

    it.skip('POST create a section fails if user send a long sectionName', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({
          sectionName: 'pizzafvfvvfergqrhergwrgwr',
          sectionDescription: 'Pizza',
        })
        .expect(400);
    });
    it.skip('POST create a section successfully (name + description)', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionName: 'pizza', sectionDescription: 'Pizza' })
        .expect(201);
    });
    it.skip('POST create a section successfully (only name)', async () => {
      expect(await Foods.countSection()).toEqual(0);
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionName: 'pizza' })
        .expect(201);
      expect(await Foods.countSection()).toEqual(1);
    });
  });

  describe('EXTRA', () => {
    it.skip('POST create an extra - show error if not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .send({ extraName: 'tomato', extraDescription: 'extra', sectionId: 1 })
        .expect(401);
    });
    it.skip('POST create an extra fails if user don/t send data', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send()
        .expect(400);
    });
    it.skip('POST create an extra fails if user don/t send extraName', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({ extraDescription: 'extra', sectionId: 1 })
        .expect(400);
    });
    it.skip('POST create an extra fails if user send extraName too long', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomatmnvkfhglhkvsdbghlg,bdigk,m elknhtklsrjhlwrnlhtekro',
          extraDescription: 'extra',
          sectionId: 1,
        })
        .expect(400);
    });
    it.skip('POST create an extra fails if user send extraName too short', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({ extraName: 't', extraDescription: 'extra', sectionId: 1 })
        .expect(400);
    });
    it.skip('POST create an extra fails if snake case format is sent', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extra_name: 'tomato',
          extraDescription: 'extra',
          sectionId: 1,
        });
    });
    it.skip('POST create an extra fails if not sectionId is sent', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomato',
          extraDescription: 'extra',
        })
        .expect(400);
    });
    it.skip('POST create an extra fails if not sectionId is not defined', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomato',
          extraDescription: 'extra',
          sectionId: 1,
        })
        .expect(500);
    });
    it.skip('POST create an extra success if not extraDescription is sent', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionName: 'pizza' })
        .expect(201);
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomato',
          sectionId: 1,
        })
        .expect(201);
    });
    it.skip('POST create an extra success', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionName: 'pizza' })
        .expect(201);
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomato',
          sectionId: 1,
          extraDescriptiuon: 'extra',
        })
        .expect(201);
    });
    it.skip('POST create an extra fails if the same extra name is sent', async () => {
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionName: 'pizza' })
        .expect(201);
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomato',
          sectionId: 1,
          extraDescriptiuon: 'extra',
        })
        .expect(201);
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomato',
          sectionId: 1,
          extraDescriptiuon: 'eegdg',
        })
        .expect(500);
    });
  });

  // it.skip('POST /foods -> create food', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/api/foods')
  //     .send({ ...foodListMockAPI[0], item_section: 1, item_extra: 1 })
  //     .set('Cookie', cookie)
  //     .expect(201);
  //   expect(response.body.results).toEqual({
  //     ...foodListMockAPI[0],
  //     item_section: 1,
  //     item_extra: 1,
  //     id: 1,
  //   });

  it.skip('/foods/all (GET) - should be able to access if authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/foods/all')
      .set('Cookie', cookie)
      .send()
      .expect(200);
    expect(response.body.results.length).toEqual(1);
  });

  it.skip('POST /foods -> create several foods', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/foods')
      .send([foodListMockAPI[1], foodListMockAPI[2]])
      .expect(201);
    expect(response.body.results).toEqual([
      { ...foodListMockAPI[1], id: 2 },
      { ...foodListMockAPI[2], id: 3 },
    ]);
  });

  it.skip('/foods/all (GET) - should be able to access if authenticated', async () => {
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
