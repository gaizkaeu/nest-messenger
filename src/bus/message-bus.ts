import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Middleware } from '../interfaces/middleware.interface';
import { Envelope } from '../envelope/envelope';
import { Bus } from '../interfaces/bus.interface';

@Injectable()
export class MessageBus implements Bus {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly middlewareTypes: Type<Middleware>[],
    public readonly name: string,
  ) {}

  async dispatch<T>(messageOrEnvelope: T | Envelope<T>): Promise<Envelope<T>> {
    const envelope =
      messageOrEnvelope instanceof Envelope
        ? messageOrEnvelope
        : new Envelope(messageOrEnvelope);

    const middlewares: Middleware[] = await Promise.all(
      this.middlewareTypes.map((type) =>
        this.moduleRef.get<Middleware>(type, { strict: false }),
      ),
    );

    const pipeline = middlewares.reduceRight(
      (next, middleware) => (env: Envelope) => middleware.handle(env, next),
      async (env: Envelope) => env,
    );

    return pipeline(envelope);
  }
}
