import 'reflect-metadata';
import { SenderMetadata } from '../interfaces/sender-metadata.interface';

export const SENDER_METADATA = Symbol('SENDER_METADATA');

export function AsSender(config: SenderMetadata): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(SENDER_METADATA, config, target);
  };
}
