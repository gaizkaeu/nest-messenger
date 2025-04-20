import { Injectable, OnModuleInit } from '@nestjs/common';
import { Envelope } from '../envelope/envelope';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { SenderMetadata } from '../interfaces/sender-metadata.interface';
import { SENDER_METADATA } from '../decorators/sender.decorator';
import { TransportNamesStamp } from '../stamps';

@Injectable()
export class SendersLocator implements OnModuleInit {
  private senders = new Map<string, (envelope: Envelope) => Envelope>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const instance = wrapper.instance;
      const metatype = wrapper.metatype;

      if (!instance || !metatype) continue;

      const meta = this.reflector.get<SenderMetadata>(
        SENDER_METADATA,
        metatype,
      );
      if (!meta) continue;

      this.senders.set(meta.transport, (envelope) => instance.send(envelope));
    }
  }
  getSenderFor(envelope: Envelope): ((envelope: Envelope) => Envelope)[] {
    let transportStamp = envelope.last(TransportNamesStamp);

    if (!transportStamp) {
      transportStamp = new TransportNamesStamp(['sync']);
      envelope = envelope.with(transportStamp);
    }

    return transportStamp.transports.map((transport) => {
      const sender = this.senders.get(transport);

      if (!sender) {
        throw new Error(
          `[SendersLocator] No sender found for transport: ${transport}`,
        );
      }

      return sender;
    });
  }
}
