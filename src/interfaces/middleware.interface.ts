import { Envelope } from '../envelope/envelope';

export interface Middleware {
  handle(
    message: Envelope,
    next: (envelope: Envelope) => Promise<Envelope>,
  ): Promise<Envelope>;
}
