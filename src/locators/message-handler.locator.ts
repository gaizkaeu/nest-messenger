import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { MESSAGE_HANDLER_METADATA } from '../decorators/message-handler.decorator';
import { Envelope } from '../envelope/envelope';
import { MessageHandler } from '../interfaces/message-handler.interface';

@Injectable()
export class MessageHandlerRegistry implements OnModuleInit {
  private handlers = new Map<Function, MessageHandler>();

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

      const messageType = this.reflector.get<Function>(
        MESSAGE_HANDLER_METADATA,
        metatype,
      );
      if (!messageType) continue;

      this.handlers.set(messageType, instance);
    }
  }

  getHandlerFor(envelope: Envelope): MessageHandler | undefined {
    const message = envelope.message;
    const constructor = Object.getPrototypeOf(message)?.constructor;
    return this.handlers.get(constructor);
  }
}
