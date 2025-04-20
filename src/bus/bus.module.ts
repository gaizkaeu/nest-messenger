import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Middleware } from '../interfaces/middleware.interface';
import { MessageBus } from './message-bus';
import {
  MessengerLocalizationModule,
  MessengerTransportationModule,
} from '../nest-messenger.module';

@Global()
@Module({})
export class BusModule {
  static register(
    name: string,
    middlewares: Type<Middleware>[],
    imports: DynamicModule[] = [],
  ): DynamicModule {
    const busProvider: Provider = {
      provide: `MESSAGE_BUS_${name.toUpperCase()}`,
      useFactory: (moduleRef: ModuleRef) =>
        new MessageBus(moduleRef, middlewares, name),
      inject: [ModuleRef],
    };

    return {
      module: BusModule,
      imports: [
        MessengerLocalizationModule,
        MessengerTransportationModule,
        ...imports,
      ],
      providers: [
        {
          provide: 'BUS_NAME',
          useValue: name,
        },
        ...middlewares,
        busProvider,
      ],
      exports: [busProvider],
    };
  }
}
