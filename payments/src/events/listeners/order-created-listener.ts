import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@pavlorozhok-org/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/orders';

export class OrderCreatedListener extends Listener <OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const {
      id,
      version,
      status,
      userId,
      ticket: {
        price,
      },
    } = data;
    const order = Order.build({
      id,
      version,
      status,
      price,
      userId,
    })
    await order.save();

    msg.ack();
  }
}
