import { Envelope } from '../envelope/envelope';
import { MessageHandler } from './message-handler.interface';

export interface Locator {
  getHandlerFor(envelope: Envelope): MessageHandler | undefined;
}
