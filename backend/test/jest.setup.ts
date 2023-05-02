import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import * as request from 'supertest';

import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { pool } from './__mocks__/pool.pg';

declare global {
  // eslint-disable-next-line no-var
  var signin: () => Promise<string[]>;
}

jest.mock('./__mocks__/postgres.db');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mongo: any;
let app: NestApplication;
// Hooks that run before evry test
beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  process.env.JWT_TOKEN = 'innscnioop57';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await pool.connect();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await pool.close();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'F4k3P4ssw0rd!';

  const response = await request(app)
    .post('/api/auth/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie;
};
