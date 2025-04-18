import { Inject } from '@nestjs/common';
import { BusDefinitionSchema } from '../schema/bus-definition.schema';

export function InjectBus(
  busIdentifier: string | BusDefinitionSchema,
): ParameterDecorator {
  return Inject(
    typeof busIdentifier === 'string'
      ? `MESSAGE_BUS_${busIdentifier.toUpperCase()}`
      : `MESSAGE_BUS_${busIdentifier.name.toUpperCase()}`,
  );
}
