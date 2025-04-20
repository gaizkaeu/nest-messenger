import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { BusModule } from './bus/bus.module';
import { BusDefinitionSchema } from './schema/bus-definition.schema';
import { MessageHandlerRegistry } from './locators/message-handler.locator';
import { SyncTransport } from './transports';
import { DiscoveryModule } from '@nestjs/core';
import { MESSAGE_HANDLER_REGISTRY, SENDER_REGISTRY } from './di-tokens';
import { SendersLocator } from './transports/sender.registry';

@Module({
  imports: [DiscoveryModule],
  providers: [
    SyncTransport,
    {
      provide: SENDER_REGISTRY,
      useClass: SendersLocator,
    },
  ],
  exports: [SENDER_REGISTRY],
})
export class MessengerTransportationModule {}

@Module({
  imports: [DiscoveryModule],
  providers: [
    {
      provide: MESSAGE_HANDLER_REGISTRY,
      useClass: MessageHandlerRegistry,
    },
  ],
  exports: [MESSAGE_HANDLER_REGISTRY],
})
export class MessengerLocalizationModule {}

@Global()
@Module({})
export class MessengerModule {
  static forRoot(buses: BusDefinitionSchema[]): DynamicModule {
    const busModules = buses.map((bus) =>
      BusModule.register(bus.name, bus.middlewares, bus.imports),
    );

    const busTokens = buses.map(
      (bus) => `MESSAGE_BUS_${bus.name.toUpperCase()}`,
    );

    const busMapProvider: Provider = {
      provide: 'MESSAGE_BUSES',
      useFactory: (...instances) => {
        const map = new Map<string, any>();
        buses.forEach((bus, i) => {
          map.set(bus.name, instances[i]);
        });
        return map;
      },
      inject: busTokens,
    };

    return {
      module: MessengerModule,
      imports: [...busModules],
      providers: [busMapProvider],
      exports: [busMapProvider],
    };
  }
}
