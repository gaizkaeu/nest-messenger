import 'reflect-metadata';

export const MESSAGE_HANDLER_METADATA = Symbol('MESSAGE_HANDLER_METADATA');

export function AsMessageHandler(messageType: Function): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(MESSAGE_HANDLER_METADATA, messageType, target);
  };
}
