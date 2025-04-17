import { Stamp } from '../interfaces/stamp.interface';

export class BusNameStamp implements Stamp {
  readonly type = 'bus';

  constructor(public readonly busName: string) {}
}
