import { Controller, Get } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern({ role: 'item', cmd: 'get-all' })
  getItems() {
    return this.appService.getItems();
  }

  @MessagePattern({ role: 'item', cmd: 'create' })
  createItem({ name }: { name: string }) {
    return this.appService.createItem({ name });
  }
}
