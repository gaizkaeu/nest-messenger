import { AsMessageHandler } from '../../../../decorators/message-handler.decorator';
import { MessageHandler } from '../../../../interfaces/message-handler.interface';
import { DemoMessage } from '../message/demo.message';

@AsMessageHandler(DemoMessage)
export class DemoHandler implements MessageHandler {
  async handle(message: DemoMessage): Promise<void> {
    return;
  }
}
