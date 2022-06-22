import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@pavlorozhok-org/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
