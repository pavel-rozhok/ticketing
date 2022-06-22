import request from 'supertest';
import app from '../../app';

it('fails when a email not exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '1111',
    })
    .expect(400);
});

it('fails when an a incorrect password issupplied', async () => {
  await signin();
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '11111',
    })
    .expect(400);
});

it('fails when an a incorrect password issupplied', async () => {
  await signin();
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '1111',
    })
    .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
});



