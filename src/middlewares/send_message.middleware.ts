import { Inject, Injectable } from '@nestjs/common';
import { Envelope } from '../envelope/envelope';
import { Middleware } from '../interfaces/middleware.interface';
import { ReceivedStamp } from '../stamps/received.stamp';
import { SendersLocator } from '../transports/sender.registry';
import { SENDER_REGISTRY } from '../di-tokens';

@Injectable()
export class SendMessageMiddleware implements Middleware {
  constructor(
    @Inject(SENDER_REGISTRY)
    private readonly senders: SendersLocator,
  ) {}

  async handle(
    envelope: Envelope,
    next: (envelope: Envelope) => Promise<Envelope>,
  ): Promise<Envelope> {
    const received = envelope.last(ReceivedStamp);
    if (received) {
      return next(envelope); // skip sending
    }

    const transports = this.senders.getSenderFor(envelope);

    for (const transport of transports) {
      envelope = await Promise.resolve(transport(envelope));
    }

    return envelope;
  }
}
