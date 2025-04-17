// envelope/envelope.ts

import { Stamp } from '../interfaces/stamp.interface';

export class Envelope<T = any> {
  constructor(
    public readonly message: T,
    private readonly _stamps: Stamp[] = [],
  ) {}

  get stamps(): Stamp[] {
    return [...this._stamps];
  }

  with(...stamp: Stamp[]): Envelope<T> {
    return new Envelope(this.message, [...this._stamps, ...stamp]);
  }

  last<TStamp extends Stamp>(
    type: new (...args: any[]) => TStamp,
  ): TStamp | undefined {
    for (let i = this._stamps.length - 1; i >= 0; i--) {
      if (this._stamps[i] instanceof type) {
        return this._stamps[i] as TStamp;
      }
    }
    return undefined;
  }
}
