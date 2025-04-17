import { Injectable } from '@nestjs/common';
import { Envelope } from '../envelope/envelope';
import { Middleware } from '../interfaces/middleware.interface';
import { ReceivedStamp } from '../stamps/received.stamp';
import { SyncTransport } from '../transports/sync.transport';

@Injectable()
export class SendMessageMiddleware implements Middleware {
  constructor(private readonly transport: SyncTransport) {}

  async handle(
    envelope: Envelope,
    next: (envelope: Envelope) => Promise<Envelope>,
  ): Promise<Envelope> {
    const received = envelope.last(ReceivedStamp);
    if (received) {
      return next(envelope); // skip sending
    }
    return await this.transport.send(envelope);
  }
}
