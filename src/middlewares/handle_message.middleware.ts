/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Middleware } from '../interfaces/middleware.interface';
import { HandledStamp } from '../stamps/handled.stamp';
import { Envelope } from '../envelope/envelope';
import { MessageHandlerRegistry } from '../locators/message-handler.locator';

@Injectable()
export class HandleMessageMiddleware implements Middleware {
  constructor(private readonly handlerRegistry: MessageHandlerRegistry) {}

  async handle(
    envelope: Envelope,
    next: (envelope: Envelope) => Promise<Envelope>,
  ): Promise<Envelope> {
    const handler = this.handlerRegistry.getHandlerFor(envelope);

    if (!handler) {
      throw new Error(
        `No handler found for message: ${JSON.stringify(envelope.message)}`,
      );
    }

    const result = await handler.handle(envelope.message);
    return envelope.with(new HandledStamp(result, handler.constructor.name));
  }
}
