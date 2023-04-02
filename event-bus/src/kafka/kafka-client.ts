import { Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';

class KafkaClient {
  private kafka: Kafka;
  private readonly logger: Logger;

  connect(broker: string) {
    return new Promise((resolve, reject) => {
      try {
        this.kafka = new Kafka({
          clientId: 'redifood',
          // Therefore the clientId should be shared across multiple instances in a cluster or horizontally scaled application, but distinct for each application.
          brokers: [broker],
          connectionTimeout: 3000, // Time in milliseconds to wait for a successful connection
          requestTimeout: 25000, // Time in milliseconds to wait for a successful request.
        });
        resolve(this.kafka);
      } catch (err) {
        this.logger.error('failed to connect to kafka', err);
        reject(err);
      }
    });
  }
}

export const kafkaClient = new KafkaClient();
