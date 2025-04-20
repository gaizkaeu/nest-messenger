import { Stamp } from '../interfaces/stamp.interface';

export class TransportNamesStamp implements Stamp {
  readonly type = 'transport-names';

  constructor(public readonly transports: string[]) {}
}
