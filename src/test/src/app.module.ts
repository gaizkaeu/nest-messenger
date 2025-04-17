import { Module } from '@nestjs/common';
import { MessengerModule } from '../../nest-messenger.module';
import { AddBusStampMiddleware } from '../../middlewares/add_bus_stamp.middleware';
import { SendMessageMiddleware } from '../../middlewares/send_message.middleware';
import { HandleMessageMiddleware } from '../../middlewares/handle_message.middleware';
import { DemoHandler } from './cqrs/handler/demo.handler';

@Module({
  imports: [
    MessengerModule.register([
      {
        name: 'default',
        middlewares: [
          AddBusStampMiddleware,
          SendMessageMiddleware,
          HandleMessageMiddleware,
        ],
      },
    ]),
  ],
  providers: [DemoHandler],
})
export class AppModule {}
