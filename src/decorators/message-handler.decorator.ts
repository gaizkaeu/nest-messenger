import 'reflect-metadata';
import { HandlerMetadata } from '../interfaces/handler-metadata.interface';

export const MESSAGE_HANDLER_METADATA = Symbol('MESSAGE_HANDLER_METADATA');

export function AsMessageHandler(config: HandlerMetadata): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(MESSAGE_HANDLER_METADATA, config, target);
  };
}
