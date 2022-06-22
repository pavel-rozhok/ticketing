import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from '@pavlorozhok-org/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
