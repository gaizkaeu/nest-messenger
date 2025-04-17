import { Stamp } from '../interfaces/stamp.interface';

export class HandledStamp implements Stamp {
  readonly type = 'handled';

  constructor(
    public readonly result: any,
    public readonly handlerName?: string,
  ) {}
}
