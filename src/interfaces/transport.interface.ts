import { Envelope } from '../envelope/envelope';

export interface Sender {
  send(message: Envelope): Promise<Envelope>;
}

export interface Receiver {
  receive(): Promise<Envelope>;
}

export interface Transport extends Sender, Receiver {}
