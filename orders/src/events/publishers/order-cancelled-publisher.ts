import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@pavlorozhok-org/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
