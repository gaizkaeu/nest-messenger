import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ModuleRef } from '@nestjs/core';
import { MessageBus } from './bus/message-bus';
import { MessageHandlerRegistry } from './locators/message-handler.locator';
import { SyncTransport } from './transports/sync.transport';
import { Middleware } from './interfaces/middleware.interface';
import { AddBusStampMiddleware } from './middlewares/add_bus_stamp.middleware';
import { SendMessageMiddleware } from './middlewares/send_message.middleware';
import { HandleMessageMiddleware } from './middlewares/handle_message.middleware';

export interface BusConfig {
  name: string;
  middlewares: Type<Middleware>[];
}

@Global()
@Module({})
export class MessengerModule {
  static register(buses: BusConfig[]): DynamicModule {
    const busTokens = buses.map(
      (bus) => `MESSAGE_BUS_${bus.name.toUpperCase()}`,
    );

    const busProviders: Provider[] = buses.map((bus) => ({
      provide: `MESSAGE_BUS_${bus.name.toUpperCase()}`,
      useFactory: (moduleRef: ModuleRef) => {
        return new MessageBus(moduleRef, bus.middlewares, bus.name);
      },
      inject: [ModuleRef],
    }));

    const busMapProvider: Provider = {
      provide: 'MESSAGE_BUSES',
      useFactory: (...buses: MessageBus[]) => {
        const map = new Map<string, MessageBus>();
        buses.forEach((bus, idx) => {
          map.set(buses[idx].name, bus);
        });
        return map;
      },
      inject: busTokens,
    };

    return {
      module: MessengerModule,
      imports: [DiscoveryModule],
      providers: [
        SyncTransport,
        MessageHandlerRegistry,
        AddBusStampMiddleware,
        SendMessageMiddleware,
        HandleMessageMiddleware,
        ...busProviders,
        busMapProvider,
      ],
      exports: [
        ...busProviders,
        SyncTransport,
        MessageHandlerRegistry,
        'MESSAGE_BUSES',
      ],
    };
  }
}
