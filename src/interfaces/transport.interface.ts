import { Envelope } from '../envelope/envelope';

export interface Transport {
  send(message: Envelope): Promise<Envelope>;
}
