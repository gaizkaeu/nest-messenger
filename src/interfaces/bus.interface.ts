import { Envelope } from '../envelope/envelope';

export interface Bus {
  readonly name: string;

  dispatch<T>(messageOrEnvelope: T | Envelope): Promise<Envelope>;
}
