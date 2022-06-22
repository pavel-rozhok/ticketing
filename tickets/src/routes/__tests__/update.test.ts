import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('return a 404 if the provider id deos not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: '1231', price: 10 })
    .expect(404);
});

it('return a 401 if the user not auth', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: '1231', price: 10 })
    .expect(401);
});

it('return a 401 if the user not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '1231', price: 10 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: '1231', price: 10 })
    .expect(401);
});

it('return a 400 if the user provides title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '1231', price: 10 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'qwd', price: -20 })
    .expect(400);
});

it('update the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '1231', price: 10 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'qwdqd', price: 20 })
    .expect(200);

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(ticket.body.title).toEqual('qwdqd');
  expect(ticket.body.price).toEqual(20);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '1231', price: 10 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'qwdqd', price: 20 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('reject edit if reserved', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '1231',
      price: 10,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);

  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'qwdqd', price: 20 })
    .expect(400);
});