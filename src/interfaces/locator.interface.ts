import { Envelope } from '../envelope/envelope';

export interface Locator {
  getHandlerFor(envelope: Envelope): [string, (message: any) => any];
}
