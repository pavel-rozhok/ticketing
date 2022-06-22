import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@pavlorozhok-org/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
