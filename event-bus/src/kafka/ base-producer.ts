import { Logger } from '@nestjs/common';
import { CompressionTypes, Kafka, Producer } from 'kafkajs';
import { Event } from '../../redifood-module/src/events/base-consumer';

export abstract class KafkaProducer<T extends Event> {
  abstract topic: T['topic'];
  protected kafkaClient: Kafka;
  private logger: Logger;
  private producer: Producer;

  constructor(kafkaClient) {
    this.kafkaClient = kafkaClient;
  }

  createProducer() {
    this.producer = this.kafkaClient.producer();
    this.logger = new Logger(`${this.topic}`);
  }

  async connect(): Promise<void> {
    // Retrieve connection even if it's fail
    try {
      await this.producer.connect(); // Try 5 times and if not working => throw an error
    } catch (err) {
      this.logger.error('failed to connect to kafka', err);
      // Add a break tim
      await this.connect();
    }
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async publish(data: T['data']): Promise<void> {
    await this.createProducer();
    await this.connect();
    // Add transaction later
    return new Promise((resolve, reject) => {
      this.producer
        .send({
          compression: CompressionTypes.GZIP,
          topic: this.topic,
          messages: [{ value: data }],
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
      this.logger.log('Event published to subject', this.topic);
      resolve();
    });
  }
}
