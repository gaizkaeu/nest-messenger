import { Type, DynamicModule } from '@nestjs/common';
import { Middleware } from '../interfaces/middleware.interface';

export interface BusDefinitionSchema {
  name: string;
  middlewares: Type<Middleware>[];
  imports: DynamicModule[];
}
