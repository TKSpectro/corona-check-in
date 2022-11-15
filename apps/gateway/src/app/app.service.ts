import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('QR_MS') private client: ClientProxy,
    @Inject('incidence-service') private incidenceClient: ClientProxy
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to gateway!' };
  }

  getItems() {
    return this.client.send({ role: 'item', cmd: 'get-all' }, {});
  }

  getItemById(id: number) {
    return this.client.send({ role: 'item', cmd: 'get-by-id' }, { id });
  }

  createItem({ name }: { name: string }) {
    return this.client.send({ role: 'item', cmd: 'create' }, { name });
  }

  getIncidenceData() {
    return this.incidenceClient.send({ role: 'incidence', cmd: 'get' }, {});
  }
}
