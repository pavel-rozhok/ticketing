import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@pavlorozhok-org/common';

import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener <OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, expiresAt } = data;

    const delay = new Date(expiresAt).valueOf() - Date.now();
    console.log('Wait:', delay);
    await expirationQueue.add(
      { orderId: id },
      { delay },
    );

    msg.ack();
  }
}
