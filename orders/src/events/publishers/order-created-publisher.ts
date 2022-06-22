import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
} from '@pavlorozhok-org/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
