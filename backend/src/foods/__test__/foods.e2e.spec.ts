import { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
import request from 'supertest';
import Foods from '../../../src/foods.postgres';
// import { AppModule } from '../../app.module';
// import { pool } from '../../pool.pg';

// const testOptionsDb = {
//   user: process.env.POSTGRES_USER_TEST,
//   host: process.env.POSTGRES_HOST_TEST,
//   database: process.env.POSTGRES_DB_NAME_TEST,
//   password: process.env.POSTGRES_PASSWORD_TEST,
//   port: parseInt(process.env.POSTGRES_PORT),
// };

const cookie = [
  'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkwTVdRMk5ESTFOVEk0WW1FeE16YzJNRFkyTmpJeVppSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRZM09UWTBOemM0TVgwLk9HWU9xVjFTMHI0OF9YUHBBZ0xLQ0FEN202bzU0cHcxRVdERGRScjYtd2sifQ==; path=/; httponly',
];
describe('FoodController (e2e)', () => {
  let app: INestApplication;

  // beforeAll(async () => {
  // const moduleRef = await Test.createTestingModule({
  //   imports: [AppModule],
  // }).compile();
  // app = moduleRef.createNestApplication();
  // await app.init();
  // // Run our migrations in new schema
  // await migrate({
  //   schema: 'public',
  //   direction: 'up',
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   log: () => {},
  //   noLock: true,
  //   dir: 'migrations',
  //   databaseUrl: testOptionsDb,
  //   migrationsTable: 'pgmigrations',
  // });
  // console.log('Migrations ran');
  // // Connect to PG as
  // await pool.connect(testOptionsDb);
  // await pool.query(`SELECT 1+1`);

  // console.log('Postgres testing connected');
  // await app.init();
  // });

  it.skip('DB is properly connected', () => expect(1 + 1).toBe(2));

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
          extraDescription: 'extra',
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
          extraDescription: 'extra',
        })
        .expect(201);
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomato',
          sectionId: 1,
          extraDescription: 'eegdg',
        })
        .expect(500);
    });
  });

  describe('DELETE SECTION EXTRA', () => {
    it.skip('DELETE /foods/section/:id -> delete section', async () => {
      expect(Number(await Foods.countSection())).toEqual(0);
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionName: 'pizza' })
        .expect(201);
      expect(Number(await Foods.countSection())).toEqual(1);
      await request(app.getHttpServer())
        .delete('/api/foods/section/1')
        .set('Cookie', cookie)
        .expect(200);
      expect(Number(await Foods.countSection())).toEqual(0);
    });

    it.skip('DELETE /foods/extra/:id -> delete extra', async () => {
      expect(Number(await Foods.countExtra())).toEqual(0);
      expect(Number(await Foods.countSection())).toEqual(0);
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
          extraDescription: 'extra',
        })
        .expect(201);
      expect(Number(await Foods.countExtra())).toEqual(1);
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'cream',
          sectionId: 1,
          extraDescription: 'extra',
        })
        .expect(201);
      expect(await Foods.countExtra()).toEqual(2);

      await request(app.getHttpServer())
        .delete('/api/foods/extra/1')
        .set('Cookie', cookie)
        .expect(200);
      expect(await Foods.countExtra()).toEqual(1);
    });

    it.skip('DELETE /foods/section/:id -> delete extra', async () => {
      expect(await Foods.countExtra()).toEqual(0);
      expect(await Foods.countSection()).toEqual(0);
      // Create a section
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionName: 'pizza' })
        .expect(201);
      expect(await Foods.countSection()).toEqual(1);
      // Create extra
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomato',
          sectionId: 1,
          extraDescription: 'extra',
        })
        .expect(201);
      expect(await Foods.countExtra()).toEqual(1);
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'cream',
          sectionId: 1,
          extraDescription: 'extra',
        })
        .expect(201);
      expect(await Foods.countExtra()).toEqual(2);

      // Delete section
      await request(app.getHttpServer())
        .delete('/api/foods/section/1')
        .set('Cookie', cookie)
        .expect(200);
      expect(await Foods.countExtra()).toEqual(0);
      expect(await Foods.countSection()).toEqual(1);
    });
  });

  describe('FOODS', () => {
    const createBasicExtraSection = async () => {
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionName: 'pizza' });
      await request(app.getHttpServer())
        .post('/api/foods/section')
        .set('Cookie', cookie)
        .send({ sectionName: 'drink' });

      expect(await Foods.countSection()).toEqual(1);
      // Create extra
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'tomato',
          sectionId: 1,
          extraDescription: 'extra',
        });
      expect(await Foods.countExtra()).toEqual(1);
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'cream',
          sectionId: 1,
          extraDescription: 'extra',
        });
      await request(app.getHttpServer())
        .post('/api/foods/extra')
        .set('Cookie', cookie)
        .send({
          extraName: 'beer',
          sectionId: 2,
          extraDescription: 'extra',
        });
    };

    const createBasicFood = async () => {
      await createBasicExtraSection();
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'pizza',
          itemPrice: 1,
          sectionId: 1,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto: 'https://images.unsplash.com/photo-16800300',
        });
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'creamm',
          itemPrice: 1,
          sectionId: 1,
          extraId: 2,
          itemQuantity: 0,
          itemDescription: 'hello',
          itemPhoto: 'https://images.unsplash.com/photo-1680dvdw0300',
        });
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'berry',
          itemPrice: 1,
          sectionId: 2,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'alcohol',
          itemPhoto: 'https://images.unsplash.com/photo-1680dvdw0300',
        });
    };

    it.skip('POST /foods -> create food fails if not authenticated', async () => {
      await request(app.getHttpServer()).post('/api/foods').send().expect(401);
    });
    it.skip('POST /foods -> create food fails if user didn/t sent body', async () => {
      await request(app.getHttpServer()).post('/api/foods').send().expect(400);
    });
    it.skip('POST /foods -> create food fails if negative price or undefined or not present', async () => {
      await createBasicExtraSection();
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'pizza',
          itemPrice: -1,
          sectionId: 1,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto:
            'https://images.unsplash.com/photo-1680030062888-e691d5992056?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        })
        .expect(400);
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'fdghr',
          sectionId: 1,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto:
            'https://images.unsplash.com/photo-1680030062888-e691d5992056?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        })
        .expect(400);
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'asd',
          itemPrice: undefined,
          sectionId: 1,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto:
            'https://images.unsplash.com/photo-1680030062888-e691d5992056?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        })
        .expect(400);
    });
    it.skip('POST /foods -> create food fails if photo is not a url', async () => {
      await createBasicExtraSection();
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'pizza',
          itemPrice: 8,
          sectionId: 1,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto: 'dvdv80',
        })
        .expect(400);
    });
    it.skip('POST /foods -> create food fails if picture is not given or undefined', async () => {
      await createBasicExtraSection();
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: undefined,
          itemPrice: 8,
          sectionId: 1,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto: 'dvdv80',
        })
        .expect(400);
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemPrice: 8,
          sectionId: 1,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto: 'dvdv80',
        })
        .expect(400);
    });

    it.skip('POST /foods -> create food fails if sectionId or extra is not given or undefined', async () => {
      await createBasicExtraSection();
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'pizza',
          itemPrice: 8,
          sectionId: undefined,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto: 'dvdv80',
        })
        .expect(400);
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'pizza',
          itemPrice: 8,
          sectionId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto: 'dvdv80',
        })
        .expect(400);
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'pizza',
          itemPrice: 8,
          sectionId: 46366,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto: 'dvdv80',
        })
        .expect(500);
    });

    it.skip('POST /foods -> create food fails if wrong keys are given', async () => {
      await createBasicExtraSection();
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemdrame: 'pizza',
          itemssfrice: 8,
          sectionId: 1,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto: 'dvdv80',
          item: 'pizza',
        })
        .expect(400);
    });
    it.skip('POST /foods -> create food', async () => {
      await createBasicExtraSection();
      await request(app.getHttpServer())
        .post('/api/foods')
        .set('Cookie', cookie)
        .send({
          itemName: 'hello',
          itemPrice: 5,
          sectionId: 1,
          extraId: 1,
          itemQuantity: 0,
          itemDescription: 'pizza',
          itemPhoto:
            'https://images.unsplash.com/photo-1680030062888-e691d5992056?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        })
        .expect(201);
      expect(await Foods.countFoods()).toEqual(1);
    });

    it.skip('/foods/all (GET) - should be able to access if authenticated', async () => {
      await createBasicFood();
      await request(app.getHttpServer())
        .get('/api/foods/all')
        .send()
        .expect(401);

      const response = await request(app.getHttpServer())
        .get('/api/foods/all')
        .set('Cookie', cookie)
        .send()
        .expect(200);
      expect(response.body.results.length).toEqual(3);
    });
    it.skip('/foods/section/:id (GET) - should be able to access if authenticated', async () => {
      await createBasicFood();
      const res1 = await request(app.getHttpServer())
        .get('/api/foods/section/1')
        .set('Cookie', cookie)
        .send()
        .expect(200);
      expect(res1.body.results.length).toEqual(2);
      const res2 = await request(app.getHttpServer())
        .get('/api/foods/section/2')
        .set('Cookie', cookie)
        .send()
        .expect(200);
      expect(res2.body.results.length).toEqual(1);
    });

    it.skip('Delete food', async () => {
      await createBasicFood();
      expect(await Foods.countFoods()).toEqual(3);
      await request(app.getHttpServer())
        .delete('/api/foods/1')
        .set('Cookie', cookie)
        .send()
        .expect(200);
      expect(await Foods.countFoods()).toEqual(2);
    });
  });

  // afterAll(async () => {
  // await migrate({
  //   schema: 'public',
  //   direction: 'down',
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   log: () => {},
  //   noLock: true,
  //   dir: 'migrations',
  //   databaseUrl: testOptionsDb,
  //   migrationsTable: 'pgmigrations',
  // });
  // console.log('Migrations down ran');
  // });
});
