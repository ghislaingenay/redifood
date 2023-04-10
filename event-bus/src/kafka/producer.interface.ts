export interface IProducer {
  connect: () => Promise<void>;
  shutdown: () => Promise<void>;
  produce: (message: any) => Promise<void>;
}
