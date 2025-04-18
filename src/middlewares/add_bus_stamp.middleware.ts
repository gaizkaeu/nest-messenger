import { Inject, Injectable } from '@nestjs/common';
import { Middleware } from '../interfaces/middleware.interface';
import { BusNameStamp } from '../stamps/bus-name.stamp';
import { Envelope } from '../envelope/envelope';

@Injectable()
export class AddBusStampMiddleware implements Middleware {
  constructor(
    @Inject('BUS_NAME')
    private readonly busName: string,
  ) {}

  async handle(
    envelope,
    next: (message: Envelope) => Promise<Envelope>,
  ): Promise<Envelope> {
    if (!envelope.last(BusNameStamp)) {
      envelope = envelope.with(new BusNameStamp(this.busName));
    }

    return next(envelope);
  }
}
