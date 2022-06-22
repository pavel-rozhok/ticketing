import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@pavlorozhok-org/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
