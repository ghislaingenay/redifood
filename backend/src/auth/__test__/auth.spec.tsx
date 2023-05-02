import { Test } from '@nestjs/testing';
import request from 'supertest';
import { EMessageErrors } from '../../../../auth/redifood-module/src/interfaces';
import { app } from '../../../../auth/src/app';
import { AppModule } from '../../../src/app.module';

const emailValid = 'test@test.com';
const emailInvalid = 'ssffn.co';
beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
});

describe('POST /api/auth/login', () => {
  it('fails when a email that does not exist is supplied', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: emailValid,
        password: 'hueheFy*_6',
      })
      .expect(400);
    expect(response.body.errors[0].message).toEqual(
      EMessageErrors.INVALID_CREDENTIALS,
    );
  });

  it('fails when an incorrect password is supplied', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhVgh',
      })
      .expect(201);
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: emailValid,
        password: 'passd',
      })
      .expect(400);
    expect(response.body.errors[0].message).toEqual(
      'password must contain at least one uppercase, one lowercase, one number and one special character',
    );
  });

  it('valid cookies with correct credentials', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(201);
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('POST /api/auth/signup', () => {
  it('returns a 201 on successful signup', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(201);
  });

  it('returns a 400 with an invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailInvalid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(400);
    expect(response.body.errors[0].message).toEqual('email should be defined');
  });

  it('returns a 400 with an invalid password', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvghFyu89*_vhhvghFyu89*_vhhvghFyu89*_vhhvgh',
      })
      .expect(400);

    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu8h',
      })
      .expect(400);

    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'fyu89*_vhhvgh',
      })
      .expect(400);
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'fyu89vhHvgh',
      })
      .expect(400);
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'fyu*_vHhvgh',
      })
      .expect(400);

    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(201);
  });

  it('returns a 400 with missing email and password', async () => {
    return request(app).post('/api/auth/signup').send({}).expect(400);
  });

  it('disallows duplicate emails', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(201);
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(400);
  });
  it('sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('signout', () => {
  it('verify that the cookies is cleared', async () => {
    const response1 = await request(app)
      .post('/api/auth/signup')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(201);
    expect(response1.get('Set-Cookie')).toBeDefined();
    const response2 = await request(app)
      .post('/api/auth/login')
      .send({
        email: emailValid,
        password: 'Fyu89*_vhhvgh',
      })
      .expect(200);

    expect(response2.get('Set-Cookie')).toBeDefined();
    const response = await request(app)
      .post('/api/auth/signout')
      .send({})
      .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
    expect(response.get('Set-Cookie')[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    );

    const arrayElements = response.get('Set-Cookie')[0].split('; ');
    expect(arrayElements[0]).toEqual('session=');
    expect(arrayElements[1]).toEqual('path=/');
    expect(arrayElements[2]).toEqual('expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });
});
