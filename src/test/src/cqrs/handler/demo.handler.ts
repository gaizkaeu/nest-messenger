import { AsMessageHandler } from '../../../../decorators/message-handler.decorator';
import { DemoMessage } from '../message/demo.message';

@AsMessageHandler({
  message: DemoMessage,
})
export class DemoHandler {
  handle(message: DemoMessage): void {
    return;
  }
}
