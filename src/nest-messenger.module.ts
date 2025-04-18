import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { BusModule } from './bus/bus.module';
import { BusDefinitionSchema } from './schema/bus-definition.schema';
import { DiscoveryModule } from '@nestjs/core';
import { MessageHandlerRegistry } from './locators/message-handler.locator';
import { SyncTransport } from './transports/sync.transport';

@Global()
@Module({})
export class MessengerModule {
  static register(buses: BusDefinitionSchema[]): DynamicModule {
    const busModules = buses.map((bus) =>
      BusModule.register(
        bus.name,
        bus.middlewares,
        [SyncTransport],
        MessageHandlerRegistry,
        [DiscoveryModule, ...bus.imports],
      ),
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
      imports: [DiscoveryModule, ...busModules],
      providers: [MessageHandlerRegistry, busMapProvider],
      exports: [...busModules, busMapProvider],
    };
  }
}
