import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class AppService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'qr',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'qr-consumer',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('items.get.all');
    this.client.subscribeToResponseOf('items.get');
    this.client.subscribeToResponseOf('items.create');

    await this.client.connect();
  }

  getData(): { message: string } {
    return { message: 'Welcome to gateway!' };
  }

  getItems() {
    return this.client.send('items.get.all', {});
  }

  getItem(id: number) {
    return this.client.send('items.get', { id: id });
  }

  createItem({ name }: { name: string }) {
    return this.client.send('items.create', { name: name });
  }
}
