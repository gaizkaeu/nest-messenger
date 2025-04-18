import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AddBusStampMiddleware } from '../../middlewares/add_bus_stamp.middleware';
import { DemoMessage } from '../src/cqrs/message/demo.message';
import { Bus } from '../../interfaces/bus.interface';
import { Envelope } from '../../envelope/envelope';
import { BusNameStamp } from '../../stamps/bus-name.stamp';
import { SentStamp } from '../../stamps/sent.stamp';
import { ReceivedStamp } from '../../stamps/received.stamp';
import { HandledStamp } from '../../stamps/handled.stamp';

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
    let response;

    beforeAll(async () => {
      const bus: Bus = moduleRef.get('MESSAGE_BUS_DEFAULT');
      const middleware = moduleRef.get(AddBusStampMiddleware);

      middlewareSpy = jest.spyOn(middleware, 'handle');

      const command = new DemoMessage();
      response = await bus.dispatch(new Envelope(command));
    });

    it('should execute command handler', () => {
      expect(middlewareSpy).toHaveBeenCalledTimes(2);
    });

    it('should return a response', () => {
      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(Envelope);
      expect(response.message).toBeInstanceOf(DemoMessage);
    });

    it('should have the correct bus name', () => {
      const busNameStamp = response.last(BusNameStamp);
      expect(busNameStamp).toBeDefined();
      expect(busNameStamp.busName).toBe('default');
    });

    it('should have handled stamp', () => {
      const handledStamp = response.last(HandledStamp);
      expect(handledStamp).toBeDefined();
      expect(handledStamp.result).toBeDefined();
      expect(handledStamp.handlerName).toBe('DemoHandler');
    });

    it('should have sent stamp', () => {
      const sentStamp = response.last(SentStamp);
      expect(sentStamp).toBeDefined();
      expect(sentStamp.transportName).toBe('sync');
    });

    it('should have received stamp', () => {
      const receivedStamp = response.last(ReceivedStamp);
      expect(receivedStamp).toBeDefined();
      expect(receivedStamp.transportName).toBe('sync');
    });
  });
  afterAll(async () => {
    await moduleRef.close();
  });
});
