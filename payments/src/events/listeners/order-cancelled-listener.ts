import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent, OrderStatus } from '@pavlorozhok-org/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/orders';

export class OrderCancelledListener extends Listener <OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const {
      id,
      version,
    } = data;

    const order = await Order.findOne({
      _id: id,
      version: version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
