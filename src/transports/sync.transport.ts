import { Inject, Injectable } from '@nestjs/common';
import { Sender } from '../interfaces/transport.interface';
import { Envelope } from '../envelope/envelope';
import { MessageBus } from '../bus/message-bus';
import { BusNameStamp } from '../stamps/bus-name.stamp';
import { ReceivedStamp } from '../stamps/received.stamp';
import { SentStamp } from '../stamps/sent.stamp';
import { AsSender } from '../decorators/sender.decorator';

@Injectable()
@AsSender({
  transport: 'sync',
})
export class SyncTransport implements Sender {
  constructor(
    @Inject('MESSAGE_BUSES')
    private readonly buses: Map<string, MessageBus>,
  ) {}

  async send(envelope: Envelope): Promise<Envelope> {
    const busNameStamp = envelope.last(BusNameStamp);
    if (!busNameStamp) {
      throw new Error(
        `[SyncTransport] No BusNameStamp found. Cannot route message.`,
      );
    }

    const bus = this.buses.get(busNameStamp.busName);
    if (!bus) {
      throw new Error(
        `[SyncTransport] No bus found for name: ${busNameStamp.busName}`,
      );
    }

    const receivedEnvelope = envelope.with(
      new ReceivedStamp('sync'),
      new SentStamp('sync'),
    );
    return await bus.dispatch(receivedEnvelope);
  }
}
