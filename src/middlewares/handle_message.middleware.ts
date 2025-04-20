/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { Middleware } from '../interfaces/middleware.interface';
import { HandledStamp } from '../stamps/handled.stamp';
import { Envelope } from '../envelope/envelope';
import { Locator } from '../interfaces';
import { MESSAGE_HANDLER_REGISTRY } from '../di-tokens';

@Injectable()
export class HandleMessageMiddleware implements Middleware {
  constructor(
    @Inject(MESSAGE_HANDLER_REGISTRY)
    private readonly handlerRegistry: Locator,
  ) {}

  async handle(
    envelope: Envelope,
    next: (envelope: Envelope) => Promise<Envelope>,
  ): Promise<Envelope> {
    const [name, handler] = this.handlerRegistry.getHandlerFor(envelope);

    if (!handler) {
      throw new Error(
        `No handler found for message: ${JSON.stringify(envelope.message)}`,
      );
    }

    const result = await Promise.resolve(handler(envelope.message));
    return envelope.with(new HandledStamp(result, name));
  }
}
