import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';

let app: NestApplication;
beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
});

describe('GET /api/users/currentuser', () => {
  it('responds with details about the current user', async () => {
    const cookie = await global.signin();

    const response = await request(app)
      .get('/api/auth/currentuser')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
  });

  it('current user of null is not authenticated', async () => {
    const response = await request(app)
      .get('/api/auth/currentuser')
      .send()
      .expect(200);
    console.log(response.body);
    expect(response.body.currentUser).toEqual(null);
  });
});
