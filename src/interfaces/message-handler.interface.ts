export interface MessageHandler<T = any> {
  handle(message: T): Promise<any>;
}
