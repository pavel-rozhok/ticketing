import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@pavlorozhok-org/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener <OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const {
      id: orderId,
      ticket: { id: ticketId },
    } = data;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId });

    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
