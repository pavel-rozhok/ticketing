import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { Subjects } from './Events/subjects';
import TicketCreatedPublisher from './Events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');
  const publisher = new TicketCreatedPublisher(stan);
  try {
    const result = await publisher.publish({
      id: '123',
      price: 123,
      title: '123444123 ',
    });
    console.log('SUCCESS');
  } catch (error) {
    console.log('ERROR');
    console.log(error);
  }

  const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
  });


  // const message = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // stan.publish(Subjects.TicketCreated, message, () => {
  //   console.log('Event published');
  // });
});

