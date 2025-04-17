import { Stamp } from '../interfaces/stamp.interface';

export class ReceivedStamp implements Stamp {
  readonly type = 'received';

  constructor(public readonly transportName: string) {}
}
