import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Middleware } from '../interfaces/middleware.interface';
import { MessageBus } from './message-bus';
import { Transport } from '../interfaces/transport.interface';
import { Locator } from '../interfaces/locator.interface';

@Module({})
export class BusModule {
  static register(
    name: string,
    middlewares: Type<Middleware>[],
    transports: Type<Transport>[],
    locator: Type<Locator>,
    imports: (Type<any> | DynamicModule)[] = [],
  ): DynamicModule {
    const busProvider: Provider = {
      provide: `MESSAGE_BUS_${name.toUpperCase()}`,
      useFactory: (moduleRef: ModuleRef) =>
        new MessageBus(moduleRef, middlewares, name),
      inject: [ModuleRef],
    };

    return {
      module: BusModule,
      imports,
      providers: [
        ...middlewares,
        ...transports,
        locator,
        busProvider,
        {
          provide: 'BUS_NAME',
          useValue: name,
        },
      ],
      exports: [busProvider],
    };
  }
}
