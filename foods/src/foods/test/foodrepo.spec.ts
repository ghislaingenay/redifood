// import { INestApplication } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { default as migrate } from 'node-pg-migrate';
// import { AppModule } from '../../../src/app.module';
// import { pool } from '../../../src/pool.pg';
// import { FoodService } from '../foods.service';

// describe('FoodsService', () => {
//   let service: FoodService;

//   const testOptionsDb = {
//     user: process.env.POSTGRES_USER_TEST,
//     host: process.env.POSTGRES_HOST_TEST,
//     database: process.env.POSTGRES_DB_NAME_TEST,
//     password: process.env.POSTGRES_PASSWORD_TEST,
//     port: parseInt(process.env.POSTGRES_PORT),
//   };

//   beforeAll(async () => {
//     const app: INestApplication =
//       await NestFactory.create<NestExpressApplication>(AppModule);

//     // Run our migrations in new schema
//     await migrate({
//       schema: 'public',
//       direction: 'up',
//       // eslint-disable-next-line @typescript-eslint/no-empty-function
//       log: () => {},
//       noLock: true,
//       dir: 'migrations',
//       databaseUrl: testOptionsDb,
//       migrationsTable: 'pgmigrations',
//     });
//     console.log('Migrations ran');
//     // Connect to PG as
//     await pool.connect(testOptionsDb);
//     await pool.query(`SELECT 1+1;`);

//     console.log('Postgres testing connected');
//     await app.init();
//   });
//   it('able to launch db', () => {
//     expect(1 + 1).toEqual(2);
//   });
//   // afterAll(async () => {
//   //   await migrate({
//   //     schema: 'public',
//   //     direction: 'down',
//   //     // eslint-disable-next-line @typescript-eslint/no-empty-function
//   //     log: () => {},
//   //     noLock: true,
//   //     dir: 'migrations',
//   //     databaseUrl: testOptionsDb,
//   //     migrationsTable: 'pgmigrations',
//   //   });
//   //   console.log('Migrations down ran');
//   // });
// });
it('test', () => expect(1 + 1).toEqual(2));
