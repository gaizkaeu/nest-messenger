import { Stamp } from '../interfaces/stamp.interface';

export class SentStamp implements Stamp {
  readonly type = 'sent';

  constructor(public readonly transportName: string) {}
}
