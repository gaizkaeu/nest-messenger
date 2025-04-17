import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AddBusStampMiddleware } from '../../middlewares/add_bus_stamp.middleware';
import { DemoMessage } from '../src/cqrs/message/demo.message';
import { Bus } from '../../interfaces/bus.interface';
import { Envelope } from '../../envelope/envelope';

describe('Basic flows', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await moduleRef.init();
  });

  describe('debug', () => {
    let middlewareSpy: jest.SpyInstance;

    beforeAll(async () => {
      const bus: Bus = moduleRef.get('MESSAGE_BUS_DEFAULT');
      const middleware = moduleRef.get(AddBusStampMiddleware);

      middlewareSpy = jest.spyOn(middleware, 'handle');

      const command = new DemoMessage();
      await bus.dispatch(new Envelope(command));
    });

    it('should execute command handler', () => {
      expect(middlewareSpy).toHaveBeenCalledTimes(2);
    });
  });
  afterAll(async () => {
    await moduleRef.close();
  });
});
