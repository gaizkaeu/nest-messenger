import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { MESSAGE_HANDLER_METADATA } from '../decorators/message-handler.decorator';
import { Envelope } from '../envelope/envelope';
import { Locator } from '../interfaces/locator.interface';
import { HandlerMetadata } from '../interfaces/handler-metadata.interface';

@Injectable()
export class MessageHandlerRegistry implements OnModuleInit, Locator {
  private handlers = new Map<Function, [string, (message: any) => any]>();

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

      const meta = this.reflector.get<HandlerMetadata>(
        MESSAGE_HANDLER_METADATA,
        metatype,
      );
      if (!meta) continue;

      this.handlers.set(meta.message, [
        instance.constructor.name,
        (message) => instance[meta.method || 'handle'](message),
      ]);
    }
  }

  getHandlerFor(envelope: Envelope): [string, (message: any) => any] {
    const message = envelope.message;
    const constructor = Object.getPrototypeOf(message)?.constructor;
    return (
      this.handlers.get(constructor) || [
        'UnknownHandler',
        () => {
          throw new Error(
            `No handler found for message: ${JSON.stringify(message)}`,
          );
        },
      ]
    );
  }
}
