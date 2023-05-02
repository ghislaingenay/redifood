import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

declare global {
  // eslint-disable-next-line no-var
  var signin: () => Promise<string[]>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mongo: any;
// Hooks that run before evry test
beforeAll(async () => {
  process.env.JWT_TOKEN = 'innscnioop57';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

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
